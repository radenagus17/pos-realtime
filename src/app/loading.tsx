import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] absolute">
      <Loader2 className="animate-spin size-10" />
    </div>
  );
}
