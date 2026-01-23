import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ImageDisplayWithPreview({ src }: { src: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="size-20 bg-secondary border mx-auto">
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
