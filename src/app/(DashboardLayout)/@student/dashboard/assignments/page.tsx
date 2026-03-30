import { getAssignmentsAction } from "@/actions/assignment-action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignmentSubmitDialog } from "./AssignmentSubmitDialog";

function fmt(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "SUBMITTED":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "GRADED":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
}

export default async function StudentAssignmentsPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string };
}) {
  const page = Number(searchParams?.page ?? 1);
  const limit = Number(searchParams?.limit ?? 10);

  const res = await getAssignmentsAction({ page, limit });
  const assignments = res?.data && Array.isArray(res.data) ? res.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
        <p className="text-muted-foreground">
          View your course assignments and submit your work.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignments.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="font-semibold text-lg">No Assignments Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You do not have any pending assignments from your tutors right now.
            </p>
          </div>
        ) : (
          assignments.map((assignment: any) => {
            const submission = assignment.submissions?.[0]; // Get the current student's submission if any
            const isSubmitted = !!submission;
            const status = submission?.status || assignment.status || "PENDING";
            
            return (
              <Card key={assignment.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {assignment.title}
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs pt-2">
                    Assigned by: <span className="font-medium text-foreground">{assignment.createdBy?.name || "Tutor"}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 p-4">
                  <div className="flex-1 space-y-4">
                    {assignment.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {assignment.description}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground/80 font-medium">
                      Date: {fmt(assignment.createdAt)}
                    </div>
                    
                    {isSubmitted && submission.grade !== null && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mt-4">
                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1">
                          Grade Received
                        </div>
                        <div className="text-2xl font-bold text-emerald-700">
                          {submission.grade} <span className="text-sm font-medium text-emerald-600/70">/ 100</span>
                        </div>
                        {submission.feedback && (
                          <div className="text-sm text-emerald-700/80 mt-2 italic">
                            "{submission.feedback}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50">
                    {!isSubmitted ? (
                       <AssignmentSubmitDialog assignmentId={assignment.id} assignmentTitle={assignment.title} />
                    ) : (
                      <div className="w-full text-center text-sm font-medium text-muted-foreground bg-muted p-2 rounded-md">
                        {submission.status === "GRADED" ? "Evaluation Complete" : "Submitted for Review"}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
