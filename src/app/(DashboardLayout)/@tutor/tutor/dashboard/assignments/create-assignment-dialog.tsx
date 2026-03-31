"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAssignmentAction } from "@/actions/tutor-action";
import { Plus, Loader2 } from "lucide-react";

type Props = {
  bookingOptions: { id: string; label: string }[];
};

export default function CreateAssignmentDialog({ bookingOptions }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (bookingId) formData.append("bookingId", bookingId);
      
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }

      const res = await createAssignmentAction(formData);
      if (res.success) {
        setOpen(false);
        setTitle("");
        setDescription("");
        setBookingId("");
        setFiles(null);
        router.refresh();
      } else {
        setError(res.message ?? "Failed to create assignment");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> New Assignment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. React Hooks Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what students should do…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Resource Files (PDF/Image/Etc)</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="cursor-pointer"
            />
            {files && files.length > 0 && (
              <p className="text-[10px] text-muted-foreground font-medium">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking">Booking (optional)</Label>
            <Select value={bookingId} onValueChange={setBookingId}>
              <SelectTrigger>
                <SelectValue placeholder="Link to a booking" />
              </SelectTrigger>
              <SelectContent>
                {bookingOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
