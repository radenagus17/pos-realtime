import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function DialogDelete({
  onSubmit,
  title,
  isLoading,
}: {
  onSubmit: () => void;
  title: string;
  isLoading: boolean;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <form className="grid gap-6">
        <DialogHeader>
          <DialogTitle>Delete {title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this{" "}
            <span className="lowercase">{title}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            variant="destructive"
            formAction={onSubmit}
          >
            {isLoading ? (
              <span className="inline-flex gap-2 items-center">
                <Loader2 className="animate-spin" /> Loading
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
