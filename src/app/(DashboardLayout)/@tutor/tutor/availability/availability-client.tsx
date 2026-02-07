"use client";

import * as React from "react";
import {
  createTutorSlotAction,
  deleteTutorSlotAction,
  updateTutorSlotAction,
} from "@/actions/availability-action";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  CalendarClock,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
};

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function toIsoFromLocalInput(localValue: string) {
  return new Date(localValue).toISOString();
}

export default function AvailabilityClient({ slots }: { slots: Slot[] }) {
  const sorted = React.useMemo(() => {
    const list = Array.isArray(slots) ? [...slots] : [];
    return list.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  }, [slots]);

  const openCount = sorted.filter((s) => !s.isBooked).length;

  // -------------------------
  // Create slot state
  // -------------------------
  const [openCreate, setOpenCreate] = React.useState(false);
  const [createStart, setCreateStart] = React.useState("");
  const [createEnd, setCreateEnd] = React.useState("");
  const [createLoading, setCreateLoading] = React.useState(false);

  // -------------------------
  // Edit slot state
  // -------------------------
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editSlotId, setEditSlotId] = React.useState<string | null>(null);
  const [editStart, setEditStart] = React.useState("");
  const [editEnd, setEditEnd] = React.useState("");
  const [editLoading, setEditLoading] = React.useState(false);

  const canSubmitCreate = createStart && createEnd && !createLoading;
  const canSubmitEdit = editSlotId && editStart && editEnd && !editLoading;

  const validateStartEnd = (startIso: string, endIso: string) => {
    const s = new Date(startIso).getTime();
    const e = new Date(endIso).getTime();
    if (Number.isNaN(s) || Number.isNaN(e)) return "Invalid date format.";
    if (e <= s) return "End time must be after start time.";
    return null;
  };

  // -------------------------
  // Create slot
  // -------------------------
  const onCreate = async () => {
    if (!createStart || !createEnd) {
      toast.error("Start and end time are required.");
      return;
    }

    const startIso = toIsoFromLocalInput(createStart);
    const endIso = toIsoFromLocalInput(createEnd);

    const err = validateStartEnd(startIso, endIso);
    if (err) {
      toast.error(err);
      return;
    }

    setCreateLoading(true);
    const toastId = toast.loading("Creating slot...");

    const res = await createTutorSlotAction({ startTime: startIso, endTime: endIso });

    setCreateLoading(false);

    if (!res.success) {
      toast.error(res?.error?.message || res?.message || "Create failed", { id: toastId });
      return;
    }

    toast.success("Slot created ✅", { id: toastId });
    setOpenCreate(false);
    setCreateStart("");
    setCreateEnd("");
  };

  // -------------------------
  // Open edit dialog
  // -------------------------
  const openEditDialog = (slot: Slot) => {
    if (slot.isBooked) {
      toast.error("Booked slots cannot be updated.");
      return;
    }
    setEditSlotId(slot.id);
    setEditStart(toLocalInputValue(slot.startTime));
    setEditEnd(toLocalInputValue(slot.endTime));
    setOpenEdit(true);
  };

  // -------------------------
  // Update slot
  // -------------------------
  const onUpdate = async () => {
    if (!editSlotId) return;

    const startIso = toIsoFromLocalInput(editStart);
    const endIso = toIsoFromLocalInput(editEnd);

    const err = validateStartEnd(startIso, endIso);
    if (err) {
      toast.error(err);
      return;
    }

    setEditLoading(true);
    const toastId = toast.loading("Updating slot...");

    const res = await updateTutorSlotAction({
      availabilityId: editSlotId,
      startTime: startIso,
      endTime: endIso,
    });

    setEditLoading(false);

    if (!res.success) {
      toast.error(res?.error?.message || res?.message || "Update failed", { id: toastId });
      return;
    }

    toast.success("Slot updated ✅", { id: toastId });
    setOpenEdit(false);
    setEditSlotId(null);
  };

  // -------------------------
  // Delete slot
  // -------------------------
  const onDelete = async (slot: Slot) => {
    if (slot.isBooked) {
      toast.error("Booked slots cannot be deleted.");
      return;
    }

    const toastId = toast.loading("Deleting slot...");

    const res = await deleteTutorSlotAction(slot.id);

    if (!res.success) {
      toast.error(res?.error?.message || res?.message || "Delete failed", { id: toastId });
      return;
    }

    toast.success("Slot deleted ✅", { id: toastId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
            <CalendarClock className="h-5 w-5" />
            Availability
          </h2>
          <p className="text-sm text-muted-foreground">
            Create time slots so students can book you.
          </p>
        </div>

        {/* Create dialog */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add slot
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Create availability slot</DialogTitle>
              <DialogDescription>
                Choose start and end time (local time). It will be stored as ISO.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start time</label>
                <Input
                  type="datetime-local"
                  value={createStart}
                  onChange={(e) => setCreateStart(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End time</label>
                <Input
                  type="datetime-local"
                  value={createEnd}
                  onChange={(e) => setCreateEnd(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenCreate(false)}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button onClick={onCreate} disabled={!canSubmitCreate}>
                {createLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create slot"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total slots</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{sorted.length}</CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Open slots</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{openCount}</CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Booked slots</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {sorted.length - openCount}
          </CardContent>
        </Card>
      </div>

      {/* Slots list */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>My slots</CardTitle>
          <p className="text-sm text-muted-foreground">
            Booked slots cannot be updated or deleted.
          </p>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4" />

          {sorted.length === 0 ? (
            <div className="rounded-lg border p-6 text-center">
              <p className="text-sm font-medium">No slots yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Click “Add slot” to create your first availability.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{fmtDateTime(s.startTime)}</p>
                    <p className="text-sm text-muted-foreground">
                      End: {fmtDateTime(s.endTime)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={s.isBooked ? "outline" : "secondary"}>
                      {s.isBooked ? "Booked" : "Open"}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      disabled={!!s.isBooked}
                      onClick={() => openEditDialog(s)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>

                    {/* Delete confirm */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                          disabled={!!s.isBooked}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this slot?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(s)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit slot</DialogTitle>
            <DialogDescription>
              Update start and end time. (Booked slots are locked)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start time</label>
              <Input
                type="datetime-local"
                value={editStart}
                onChange={(e) => setEditStart(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End time</label>
              <Input
                type="datetime-local"
                value={editEnd}
                onChange={(e) => setEditEnd(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)} disabled={editLoading}>
              Cancel
            </Button>
            <Button onClick={onUpdate} disabled={!canSubmitEdit}>
              {editLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update slot"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
