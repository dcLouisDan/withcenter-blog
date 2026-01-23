import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ImageDisplayWithPreview({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn("size-20 bg-secondary border mx-auto", className)}
        >
          <img src={src} className="object-cover" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="sr-only">
          <DialogTitle>Comment Image</DialogTitle>
          <DialogDescription>{src}</DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <img src={src} className="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
