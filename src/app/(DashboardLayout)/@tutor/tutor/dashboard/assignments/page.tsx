import {
  getTutorAssignmentsAction,
  getTutorSessionsAction,
} from "@/actions/tutor-action";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import CreateAssignmentDialog from "./create-assignment-dialog";
import EvaluateDialog from "./evaluate-dialog";
import { AssignmentsCharts } from "./assignments-charts";

export default async function TutorAssignmentsPage() {
  const [assignmentsRes, sessionsRes] = await Promise.all([
    getTutorAssignmentsAction({ limit: 100 }),
    getTutorSessionsAction({ limit: 100 }),
  ]);

  const assignments = Array.isArray(assignmentsRes.data)
    ? assignmentsRes.data
    : [];
  const sessions = Array.isArray(sessionsRes.data) ? sessionsRes.data : [];

  // Build booking options for the create dialog
  const bookingOptions = sessions
    .filter((s: any) => s.status === "CONFIRMED" || s.status === "COMPLETED")
    .map((s: any) => ({
      id: s.id,
      label: `${s.student?.name ?? "Student"} — ${new Date(s.scheduledStart).toLocaleDateString()}`,
    }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70 flex items-center gap-2">
            Professional Assignments
          </h2>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-violet-500" />
            Manage your student curriculum and evaluate performance
          </p>
        </div>
        <CreateAssignmentDialog bookingOptions={bookingOptions} />
      </div>

      {/* 📊 Assignment Analytics */}
      <AssignmentsCharts assignments={assignments} />

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No assignments yet. Create your first one above.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((a: any) => {
            const subs = a.submissions ?? [];
            const pending = subs.filter(
              (s: any) => s.grade === null || s.grade === undefined
            );

            return (
              <Card
                key={a.id}
                className="transition-colors hover:bg-muted/30"
              >
                <CardContent className="p-4 space-y-3">
                  {/* Assignment Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{a.title}</p>
                      {a.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                          {a.description}
                        </p>
                      )}
                      
                      {/* 🔥 Assignment Resources (PDFs) */}
                      {a.files && Array.isArray(a.files) && a.files.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 font-black italic">
                          {a.files.map((file: any, idx: number) => (
                            <a 
                              key={idx} 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                            >
                              Resource {idx + 1}
                            </a>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        Created{" "}
                        {new Date(a.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary">
                        {subs.length} submission{subs.length !== 1 && "s"}
                      </Badge>
                      {pending.length > 0 && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
                          {pending.length} to grade
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Submissions */}
                  {subs.length > 0 && (
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Submissions
                      </p>
                      {subs.map((sub: any) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between rounded-md bg-muted/50 p-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium">
                              {sub.student?.name ?? "Student"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submitted{" "}
                              {new Date(
                                sub.createdAt
                              ).toLocaleDateString()}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {sub.files && sub.files.length > 0 && sub.files.map((file: any, idx: number) => (
                                <a 
                                  key={idx}
                                  href={file.url} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
                                >
                                  📄 Answersheet {idx + 1}
                                </a>
                              ))}
                              {sub.evaluationReport && (
                                <a 
                                  href={sub.evaluationReport.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100 transition-colors flex items-center gap-1"
                                >
                                  ★ Evaluation Report
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {sub.grade !== null &&
                            sub.grade !== undefined ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                                Grade: {sub.grade}
                              </Badge>
                            ) : (
                              <EvaluateDialog
                                assignmentId={a.id}
                                submissionId={sub.id}
                                studentName={
                                  sub.student?.name ?? "Student"
                                }
                                submissionFiles={sub.files}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
