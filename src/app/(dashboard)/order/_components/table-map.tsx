import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useTables } from "@/hooks/use-tables";
import { cn } from "@/lib/utils";
import { Background, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Fragment,
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import DialogCreateOrderDineIn from "./dialog-create-order-dine-in";
import Link from "next/link";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedTableAtom } from "@/stores/table-store";
import { OrderTypes } from "@/types/order";
import { TableTypes } from "@/types/table";
import { updateReservation } from "../lib/actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { profileAtom } from "@/stores/auth-store";

export function TableNode({
  data,
}: {
  data: {
    id: number;
    label: string;
    capacity: number;
    status: string;
    order?: {
      id: string;
      order_id: string;
      customer_name: string;
    };
    handleReservation: ({
      id,
      status,
      table_id,
    }: {
      id: string;
      status: string;
      table_id?: string;
    }) => void;
  };
}) {
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  const setSelectedTable = useSetAtom(selectedTableAtom);
  const profile = useAtomValue(profileAtom);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "bg-muted rounded-lg flex items-center justify-center outline-2 outline-offset-4 outline-dashed cursor-pointer",
            {
              "w-20 h-20": data.capacity === 2,
              "w-32 h-20": data.capacity === 4,
              "w-38 h-20": data.capacity === 6,
              "w-48 h-20": data.capacity === 8,
              "w-64 h-20": data.capacity === 10,
              "w-72 h-20": data.capacity === 12,
            },
            {
              "outline-amber-600": data.status === "reserved",
              "outline-green-600": data.status === "available",
              "outline-blue-600": data.status === "unavailable",
            },
          )}
        >
          {data.label}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="mt-2">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Table {data.label}</h4>
          <p className="text-xs text-muted-foreground">
            Capacity: {data.capacity}
          </p>
          <p className="text-xs text-muted-foreground">Status: {data.status}</p>
          {data.order ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Order ID : {data.order.order_id}
              </p>
              <p className="text-xs text-muted-foreground">
                Customer : {data.order.customer_name}
              </p>
              {data.status === "unavailable" ? (
                <Button className="mt-2 w-full cursor-pointer" asChild>
                  <Link href={`/order/${data.order.order_id}`}>
                    View Detail Order
                  </Link>
                </Button>
              ) : (
                <Fragment>
                  {profile.role !== "kitchen" && (
                    <div className="w-full mt-2 flex gap-2">
                      <Button
                        variant="destructive"
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          data.handleReservation({
                            id: `${data?.order?.id}`,
                            status: "canceled",
                            table_id: String(data.id),
                          })
                        }
                      >
                        Canceled
                      </Button>
                      <Button
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          data.handleReservation({
                            id: `${data?.order?.id}`,
                            status: "process",
                            table_id: String(data.id),
                          })
                        }
                      >
                        Process
                      </Button>
                    </div>
                  )}
                </Fragment>
              )}
            </div>
          ) : (
            <Fragment>
              {profile.role !== "kitchen" && (
                <Dialog
                  open={openCreateOrder}
                  onOpenChange={setOpenCreateOrder}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="cursor-pointer mt-2"
                      onClick={() =>
                        setSelectedTable({ id: data.id, name: data.label })
                      }
                    >
                      Create Order
                    </Button>
                  </DialogTrigger>
                  <DialogCreateOrderDineIn
                    closeDialog={() => setOpenCreateOrder(false)}
                  />
                </Dialog>
              )}
            </Fragment>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function TableMap({
  activeOrders,
  dataTables,
}: {
  activeOrders: OrderTypes[];
  dataTables: TableTypes[];
}) {
  const nodeTypes = {
    tableNode: TableNode,
  };

  const [reservedState, reservedAction] = useActionState(
    updateReservation,
    INITIAL_STATE_ACTION,
  );

  const handleReservation = ({
    id,
    table_id,
    status,
  }: {
    id: string;
    table_id?: string;
    status: string;
  }) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    if (table_id !== undefined) {
      formData.append("table_id", table_id);
    }
    startTransition(() => {
      reservedAction(formData);
    });
  };

  const initialNodes = useMemo(() => {
    return dataTables.map((table) => ({
      id: String(table.id),
      position: { x: table.position_x || 0, y: table.position_y || 0 },
      data: {
        id: table.id,
        label: table.name,
        capacity: table.capacity,
        status: table.status,
        order: activeOrders.find((order) => {
          const tables = order.tables as TableTypes;
          if (tables) return tables.id === table.id;
        }),
        handleReservation,
      },
      type: "tableNode",
    }));
  }, [dataTables, activeOrders]);

  useEffect(() => {
    if (reservedState?.status === "error") {
      toast.error("Update Reservation Failed", {
        description: reservedState.errors?._form?.[0],
      });
    }

    if (reservedState?.status === "success") {
      toast.success("Update Reservation Success");
    }
  }, [reservedState?.status]);

  return (
    <div className="w-[100%] h-[80vh] border rounded-lg">
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodes={initialNodes}
        nodeTypes={nodeTypes}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
