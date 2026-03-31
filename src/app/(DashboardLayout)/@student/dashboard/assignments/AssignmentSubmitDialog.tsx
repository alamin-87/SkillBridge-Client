"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitAssignmentAction } from "@/actions/assignment-action";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AssignmentSubmitDialog({ assignmentId, assignmentTitle }: { assignmentId: string; assignmentTitle: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await submitAssignmentAction(assignmentId, formData);
      if (res?.success) {
        toast.success("Assignment submitted successfully!");
        setOpen(false);
        setFiles(null);
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to submit assignment.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full font-semibold shadow-sm hover:shadow-md transition-all gap-2" variant="default">
          <UploadCloud className="h-4 w-4" />
          Submit Answer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Assignment</DialogTitle>
          <DialogDescription>
            Upload your work for <strong>{assignmentTitle}</strong>. 
            You can upload up to 5 files.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Upload Documents (Any)</Label>
            <div className={`
              border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors
              ${files && files.length > 0 ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}
            `}>
              <Input
                id="file"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
              />
              <Label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-2">
                {files && files.length > 0 ? (
                  <>
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-sm truncate max-w-[200px]">
                      {files.length} file(s) selected
                    </span>
                    <span className="text-xs text-muted-foreground">Click to change files</span>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm">Browse files</span>
                    <span className="text-xs text-muted-foreground">Any file up to 5MB</span>
                  </>
                )}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!files || files.length === 0 || loading}>
              {loading ? "Uploading..." : "Submit Answer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
