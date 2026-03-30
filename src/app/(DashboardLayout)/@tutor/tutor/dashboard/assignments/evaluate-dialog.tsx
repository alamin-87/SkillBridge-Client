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
import { evaluateSubmissionAction } from "@/actions/tutor-action";
import { Star, Loader2 } from "lucide-react";

type Props = {
  assignmentId: string;
  submissionId: string;
  studentName: string;
};

export default function EvaluateDialog({
  assignmentId,
  submissionId,
  studentName,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const num = Number(grade);
    if (isNaN(num) || num < 0 || num > 100) {
      setError("Grade must be a number between 0 and 100");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await evaluateSubmissionAction(
        assignmentId,
        submissionId,
        {
          grade: num,
          feedback: feedback.trim() || undefined,
        }
      );
      if (res.success) {
        setOpen(false);
        setGrade("");
        setFeedback("");
        router.refresh();
      } else {
        setError(res.message ?? "Failed to evaluate");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-amber-600 border-amber-200 hover:bg-amber-50 gap-1"
        >
          <Star className="h-3.5 w-3.5" /> Grade
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Evaluate — {studentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="grade">Grade (0–100) *</Label>
            <Input
              id="grade"
              type="number"
              min={0}
              max={100}
              placeholder="85"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Great work! Consider reviewing…"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
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
            Submit Grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
