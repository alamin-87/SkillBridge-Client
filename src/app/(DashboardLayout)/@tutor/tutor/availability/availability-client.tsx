"use client";

import * as React from "react";
import {
  createTutorSlotAction,
  deleteTutorSlotAction,
  updateTutorSlotAction,
  bulkCreateTutorSlotsAction,
} from "@/actions/availability-action";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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

import { getIconComponent } from "@/lib/icon-mapper";
import { toast } from "sonner";

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  type?: "SINGLE" | "PACKAGE_30D";
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
  // Resolved Icons via Mapper
  const CalendarClockIcon = getIconComponent("CalendarClock");
  const PlusIcon = getIconComponent("Plus");
  const PencilIcon = getIconComponent("Pencil");
  const Trash2Icon = getIconComponent("Trash2");
  const Loader2Icon = getIconComponent("Loader2");
  const SparklesIcon = getIconComponent("Sparkles");

  const sorted = React.useMemo(() => {
    const list = Array.isArray(slots) ? [...slots] : [];
    return list.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  }, [slots]);

  const openCount = sorted.filter((s) => !s.isBooked).length;

  // -------------------------
  // Bulk (Smart) create state
  // -------------------------
  const [openBulk, setOpenBulk] = React.useState(false);
  const [bulkStart, setBulkStart] = React.useState("");
  const [bulkLoading, setBulkLoading] = React.useState(false);

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
  const canSubmitBulk = bulkStart && !bulkLoading;
  const canSubmitEdit = editSlotId && editStart && editEnd && !editLoading;

  const validateStartEnd = (startIso: string, endIso: string) => {
    const s = new Date(startIso).getTime();
    const e = new Date(endIso).getTime();
    if (Number.isNaN(s) || Number.isNaN(e)) return "Invalid date format.";
    if (e <= s) return "End time must be after start time.";
    return null;
  };

  // -------------------------
  // Smart Package Create (30 days)
  // -------------------------
  const onBulkCreate = async () => {
    if (!bulkStart) {
      toast.error("Start date and time is required.");
      return;
    }

    setBulkLoading(true);
    const tid = toast.loading("Deploying 30-day private package...");

    try {
      const s = new Date(bulkStart);
      const e = new Date(s.getTime() + 60 * 60 * 1000); // Default 1 hour

      const sIso = s.toISOString();
      const eIso = e.toISOString();

      // Conflict detection for the start slot
      const hasConflict = sorted.some((ex) => {
        const exS = new Date(ex.startTime).getTime();
        const exE = new Date(ex.endTime).getTime();
        const newS = s.getTime();
        const newE = e.getTime();
        return newS < exE && newE > exS;
      });

      if (hasConflict) {
        toast.error("This time period overlaps with an existing slot.", { id: tid });
        setBulkLoading(false);
        return;
      }

      const res = await createTutorSlotAction({ 
        startTime: sIso, 
        endTime: eIso, 
        type: "PACKAGE_30D" 
      });

      if (!res.success) {
        toast.error(res.message || "Package creation failed", { id: tid });
      } else {
        toast.success("30-Day Private Package deployed! Students can now book the full month.", { id: tid });
        setOpenBulk(false);
        setBulkStart("");
      }
    } catch (err: any) {
      toast.error(err.message || "Creation error", { id: tid });
    } finally {
      setBulkLoading(false);
    }
  };

  // -------------------------
  // Create single slot
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

    const hasConflict = sorted.some((ex) => {
      const exS = new Date(ex.startTime).getTime();
      const exE = new Date(ex.endTime).getTime();
      const newS = new Date(startIso).getTime();
      const newE = new Date(endIso).getTime();
      return newS < exE && newE > exS;
    });

    if (hasConflict) {
      toast.error("This slot overlaps with existing availability.");
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="inline-flex items-center gap-2 text-xl font-black uppercase tracking-tight">
            <CalendarClockIcon className="h-6 w-6 text-indigo-500" />
            Scheduling Assistant
          </h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Generate recurring 30-day schedules or create individual sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Smart Schedule Dialog */}
          <Dialog open={openBulk} onOpenChange={setOpenBulk}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full border-2 border-indigo-500/20 hover:bg-indigo-500/5 hover:text-indigo-600 font-bold">
                <SparklesIcon className="h-4 w-4" />
                Smart Schedule (30D)
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-500 to-purple-500" />
              <DialogHeader>
                <DialogTitle className="text-xl font-black">Smart Recurring Schedule</DialogTitle>
                <DialogDescription className="font-medium text-xs">
                  We'll create 30 one-hour sessions (one per day) starting from the selected time.
                  Conflicts with existing slots will be automatically handled.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Base Start Moment</label>
                  <Input
                    type="datetime-local"
                    value={bulkStart}
                    onChange={(e) => setBulkStart(e.target.value)}
                    className="h-12 bg-muted/50 rounded-xl"
                  />
                </div>
                <div className="rounded-xl bg-indigo-50 p-4 flex items-start gap-3 border border-indigo-100">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-indigo-600">
                    <SparklesIcon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-medium text-indigo-700 leading-relaxed">
                    Tutor AI will duplicate this time for the next 30 consecutive days, excluding any time periods where you already have active sessions.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setOpenBulk(false)}>Discard</Button>
                <Button onClick={onBulkCreate} disabled={!canSubmitBulk} className="rounded-xl font-black bg-indigo-600 shadow-lg shadow-indigo-600/20 text-white">
                   {bulkLoading ? <Loader2Icon className="animate-spin" /> : "Deploy Schedule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create Individual slot */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-full font-bold bg-slate-900 shadow-lg shadow-slate-900/20 text-white">
                <PlusIcon className="h-4 w-4" />
                Add Single Slot
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">Individual Slot</DialogTitle>
                <DialogDescription className="font-medium text-xs text-muted-foreground">
                  Precision scheduling for custom session lengths.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session Start</label>
                  <Input
                    type="datetime-local"
                    value={createStart}
                    onChange={(e) => setCreateStart(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session End</label>
                  <Input
                    type="datetime-local"
                    value={createEnd}
                    onChange={(e) => setCreateEnd(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button variant="ghost" onClick={() => setOpenCreate(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={onCreate} disabled={!canSubmitCreate} className="rounded-xl font-black bg-slate-900 text-white">
                  {createLoading ? <Loader2Icon className="animate-spin h-4 w-4" /> : "Commit Slot"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm group hover:border-indigo-500/20 transition-all">
          <CardHeader className="pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">{sorted.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm group hover:border-emerald-500/20 transition-all">
          <CardHeader className="pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Market Open</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-emerald-600">{openCount}</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm group hover:border-amber-500/20 transition-all">
          <CardHeader className="pb-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reserved Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-amber-600">
              {sorted.length - openCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Slots Matrix */}
      <Card className="shadow-xs border-primary/5 bg-card/40 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Availability Matrix</CardTitle>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter mt-1 italic">
              Locked sessions cannot be modified or deleted once booked.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-tighter bg-muted/50 border-2">
             Live Schedule
          </Badge>
        </CardHeader>

        <CardContent>
          {sorted.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-primary/5 p-12 text-center bg-muted/5">
              <CalendarClockIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-40 mb-4" />
              <p className="text-sm font-black text-foreground">Schedule Vacant</p>
              <p className="mt-1 text-xs text-muted-foreground font-medium max-w-[200px] mx-auto uppercase tracking-wider">
                Use Smart Schedule to fill 30 days instantly.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {sorted.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "group flex flex-col gap-4 rounded-3xl border-2 p-5 transition-all duration-500",
                    "bg-card/40 backdrop-blur-xl border-primary/5",
                    "hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10",
                    s.isBooked 
                      ? "hover:border-rose-500/20" 
                      : "hover:border-indigo-500/20"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-black text-base uppercase tracking-tight text-foreground/90 group-hover:text-indigo-600 transition-colors duration-300">
                        {fmtDateTime(s.startTime)}
                      </p>
                      <div className="flex items-center gap-2">
                         <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", s.isBooked ? "bg-rose-400" : "bg-emerald-400")} />
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                           Expires at {fmtDateTime(s.endTime).split(',')[1]}
                         </p>
                      </div>
                    </div>
                    <Badge className={cn(
                      "rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest border-2 transition-all duration-300",
                      s.isBooked 
                        ? "bg-rose-500/5 text-rose-600 border-rose-100/50 group-hover:border-rose-500/30" 
                        : s.type === "PACKAGE_30D"
                          ? "bg-indigo-500/5 text-indigo-600 border-indigo-100/50 group-hover:border-indigo-500/30"
                          : "bg-emerald-500/5 text-emerald-600 border-emerald-100/50 group-hover:border-emerald-500/30"
                    )} variant="outline">
                       {s.isBooked ? "Reserved" : s.type === "PACKAGE_30D" ? "30D Package" : "Single"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-auto border-t border-primary/5 group-hover:border-indigo-500/10 transition-colors duration-500">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 rounded-2xl font-black h-10 text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-500/10 hover:text-indigo-600"
                      disabled={!!s.isBooked}
                      onClick={() => openEditDialog(s)}
                    >
                      <PencilIcon className="h-3.5 w-3.5 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                      Configure
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 rounded-2xl font-black h-10 text-[10px] uppercase tracking-widest transition-all hover:bg-rose-500/10 hover:text-rose-600"
                          disabled={!!s.isBooked}
                        >
                          <Trash2Icon className="h-3.5 w-3.5 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                          Purge
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-8">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-black text-2xl tracking-tighter">Decommission Session</AlertDialogTitle>
                          <AlertDialogDescription className="font-medium text-muted-foreground leading-relaxed">
                            Removing this slot will permanently withdraw your availability from the student marketplace.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="pt-6 gap-3">
                          <AlertDialogCancel className="rounded-2xl font-black h-12 uppercase tracking-widest border-2">Retain</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(s)} className="rounded-2xl font-black h-12 uppercase tracking-widest bg-rose-600 text-white shadow-xl shadow-rose-600/20 hover:bg-rose-700">
                            Confirm Purge
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
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Modify Sequence</DialogTitle>
            <DialogDescription className="font-medium text-xs text-muted-foreground">
              Synchronize new time offsets for this individual session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Sequence</label>
              <Input
                type="datetime-local"
                value={editStart}
                onChange={(e) => setEditStart(e.target.value)}
                className="rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">End Sequence</label>
              <Input
                type="datetime-local"
                value={editEnd}
                onChange={(e) => setEditEnd(e.target.value)}
                className="rounded-xl h-12"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenEdit(false)} disabled={editLoading} className="rounded-xl font-bold">Discard</Button>
            <Button onClick={onUpdate} disabled={!canSubmitEdit} className="rounded-xl font-black bg-slate-900 border-2 border-slate-900 hover:bg-transparent hover:text-slate-900 transition-all text-white">
              {editLoading ? <Loader2Icon className="animate-spin h-4 w-4" /> : "Commit Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
