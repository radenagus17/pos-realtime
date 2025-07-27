export type DataTableFilterField<TData> = {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
};

export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
};
