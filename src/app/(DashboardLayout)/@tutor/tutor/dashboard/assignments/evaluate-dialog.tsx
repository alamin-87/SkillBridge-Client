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
import { Star, Loader2, FileText, ExternalLink } from "lucide-react";

type Props = {
  assignmentId: string;
  submissionId: string;
  studentName: string;
  submissionFiles?: { url: string; name?: string }[];
};

export default function EvaluateDialog({
  assignmentId,
  submissionId,
  studentName,
  submissionFiles = [],
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  function handleSubmit() {
    const num = Number(grade);
    if (isNaN(num) || num < 0 || num > 100) {
      setError("Grade must be a number between 0 and 100");
      return;
    }
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("grade", num.toString());
      formData.append("feedback", feedback.trim());
      if (reportFile) {
        formData.append("files", reportFile);
      }

      const res = await evaluateSubmissionAction(
        assignmentId,
        submissionId,
        formData
      );
      if (res.success) {
        setOpen(false);
        setGrade("");
        setFeedback("");
        setReportFile(null);
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
          {/* 🔥 Display Student Submissions */}
          {submissionFiles.length > 0 && (
            <div className="p-3 rounded-lg border bg-blue-50/50 border-blue-100 space-y-2">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                <FileText className="h-3 w-3" /> Student Answer Sheet(s)
              </p>
              <div className="flex flex-wrap gap-2">
                {submissionFiles.map((f, i) => (
                  <a
                    key={i}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1 bg-white border border-blue-200 rounded text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    View Answer {submissionFiles.length > 1 ? i + 1 : ""}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

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

          <div className="space-y-2">
            <Label htmlFor="report">Evaluation Report (Any)</Label>
            <Input
              id="report"
              type="file"
              onChange={(e) => setReportFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
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
