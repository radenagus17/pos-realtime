import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { TableTypes } from "@/types/table";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { applyNodeChanges, Background, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export function TableNode({
  data,
}: {
  data: {
    id: string;
    label: string;
    capacity: number;
    status: string;
  };
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "bg-muted rounded-lg flex items-center justify-center outline-2 outline-offset-4 outline-dashed",
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
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function TableMap({ tables }: { tables: TableTypes[] }) {
  const nodeTypes = {
    tableNode: TableNode,
  };

  const initialNodes = useMemo(() => {
    return tables.map((table) => ({
      id: String(table.id),
      position: { x: table.position_x ?? 0, y: table.position_y ?? 0 },
      data: {
        id: table.id,
        label: table.name,
        capacity: table.capacity,
        status: table.status,
      },
      type: "tableNode",
    }));
  }, [tables]);

  const [nodes, setNodes] = useState(initialNodes);
  const supabase = createClient();

  const onNodesChange = useCallback(
    async (changes: any) => {
      setNodes((nodesSnapshot) => {
        if (!nodesSnapshot || nodesSnapshot.length === 0) return [];
        return applyNodeChanges(changes, nodesSnapshot);
      });

      if (changes[0]?.dragging !== undefined && changes[0].dragging === false) {
        const { status } = await supabase
          .from("tables")
          .update({
            position_x: changes[0]?.position?.x,
            position_y: changes[0]?.position?.y,
          })
          .eq("id", changes[0].id);

        if (status === 204) {
          toast.success("Table position updated");
        }
      }
    },
    [supabase],
  );

  return (
    <div className="w-[100%] h-[80vh] border rounded-lg">
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
