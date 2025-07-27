"use client";

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { DataTableFilterField } from "@/types/data-table";
import { useDebouncedCallback } from "./use-debounce-callback";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
  type Parser,
  type UseQueryStateOptions,
} from "nuqs";

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  filterFields?: DataTableFilterField<TData>[];
  history?: "push" | "replace";
  scroll?: boolean;
  shallow?: boolean;
  throttleMs?: number;
  debounceMs?: number;
  startTransition?: React.TransitionStartFunction;
  clearOnDefault?: boolean;
}

export function useDataTable<TData>({
  pageCount = -1,
  filterFields = [],
  history = "replace",
  scroll = false,
  shallow = true,
  throttleMs = 50,
  debounceMs = 300,
  startTransition,
  clearOnDefault = false,

  ...props
}: UseDataTableProps<TData>) {
  const queryStateOptions = useMemo<
    Omit<UseQueryStateOptions<string>, "parse">
  >(() => {
    return {
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    };
  }, [
    history,
    scroll,
    shallow,
    throttleMs,
    debounceMs,
    clearOnDefault,
    startTransition,
  ]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withOptions(queryStateOptions).withDefault(1)
  );
  const [size, setSize] = useQueryState(
    "size",
    parseAsInteger.withOptions(queryStateOptions).withDefault(10)
  );

  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withOptions(queryStateOptions).withDefault(`created_at.desc`)
  );

  const [column, order] = sort?.split(".") ?? [];

  const filterParsers = useMemo(() => {
    return filterFields.reduce<
      Record<string, Parser<string> | Parser<string[]>>
    >((acc, field) => {
      if (field.options) {
        // Faceted filter
        acc[field.value as string] = parseAsArrayOf(
          parseAsString,
          "."
        ).withOptions(queryStateOptions);
      } else {
        // Search filter
        acc[field.value as string] =
          parseAsString.withOptions(queryStateOptions);
      }
      return acc;
    }, {});
  }, [filterFields, queryStateOptions]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers);

  const debouncedSetFilterValues = useDebouncedCallback(
    setFilterValues,
    debounceMs
  );

  // Paginate
  const pagination: PaginationState = {
    pageIndex: page - 1, // zero-based index -> one-based index
    pageSize: size,
  };

  function onPaginationChange(updaterOrValue: Updater<PaginationState>) {
    if (typeof updaterOrValue === "function") {
      const newPagination = updaterOrValue(pagination);
      void setPage(newPagination.pageIndex + 1);
      void setSize(newPagination.pageSize);
    } else {
      void setPage(updaterOrValue.pageIndex + 1);
      void setSize(updaterOrValue.pageSize);
    }
  }

  // Sort
  const sorting: SortingState = [
    {
      id: column ?? "created_at",
      desc: !order || order === "desc" ? true : false,
    },
  ];

  function onSortingChange(updaterOrValue: Updater<SortingState>) {
    if (typeof updaterOrValue === "function") {
      const newSorting = updaterOrValue(sorting);
      void setSort(
        `${newSorting[0]?.id}.${newSorting[0]?.desc ? "desc" : "asc"}`
      );
    }
  }

  // Filter
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null) {
          filters.push({
            id: key,
            value: Array.isArray(value) ? value : [value],
          });
        }
        return filters;
      },
      []
    );
  }, [filterValues]);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  const onColumnFiltersChange = useCallback(
    (updateOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next =
          typeof updateOrValue === "function"
            ? updateOrValue(prev)
            : updateOrValue;

        const filterUpdates = next.reduce<
          Record<string, string | string[] | null>
        >((acc, filter) => {
          const value = filter.value as string | string[];
          if (searchableColumns.find((col) => col.value === filter.id)) {
            // For search filters, use the value directly
            acc[filter.id] = value;
          } else if (filterableColumns.find((col) => col.value === filter.id)) {
            // For faceted filters, use the array of values
            acc[filter.id] = value;
          }
          return acc;
        }, {});

        // Handle filter removal
        prev.forEach((prevFilter) => {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        });

        debouncedSetFilterValues((prev) => ({
          ...prev,
          ...filterUpdates,
        }));
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns, searchableColumns]
  );

  const table = useReactTable({
    ...props,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table };
}
