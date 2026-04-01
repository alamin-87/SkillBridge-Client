import Link from "next/link";
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

import { DeleteAssignmentButton } from "./delete-assignment-button";

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
              (s: any) => s.grade === null || s.grade === undefined,
            );

            return (
              <Card key={a.id} className="transition-colors hover:bg-muted/30">
                <CardContent className="p-4 space-y-3">
                  {/* Assignment Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-lg pr-4">
                        {a.title}
                      </p>

                      {a.booking?.student && (
                        <Link
                          href={`/users/${a.booking.student.id}`}
                          className="flex items-center gap-1.5 mt-1 text-sm font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100 hover:bg-emerald-100/50 hover:text-emerald-700 transition-all duration-200 group"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Assigned to:{" "}
                          <span className="group-hover:underline underline-offset-4 decoration-emerald-200">
                            {a.booking.student.name}
                          </span>
                        </Link>
                      )}

                      {a.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {a.description}
                        </p>
                      )}

                      {/* 🔥 Assignment Resources (PDFs) */}
                      {a.files &&
                        Array.isArray(a.files) &&
                        a.files.length > 0 && (
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
                        Created {new Date(a.createdAt).toLocaleDateString()}
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

                      {/* Delete Assignment UI Component */}
                      <DeleteAssignmentButton assignmentId={a.id} />
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
                            <Link
                              href={`/users/${sub.student.id}`}
                              className="text-sm font-medium hover:text-primary hover:underline underline-offset-2 transition-colors cursor-pointer"
                            >
                              {sub.student?.name ?? "Student"}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              Submitted{" "}
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {sub.files &&
                                sub.files.length > 0 &&
                                sub.files.map((file: any, idx: number) => (
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
                            {sub.grade !== null && sub.grade !== undefined ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                                Grade: {sub.grade}
                              </Badge>
                            ) : (
                              <EvaluateDialog
                                assignmentId={a.id}
                                submissionId={sub.id}
                                studentName={sub.student?.name ?? "Student"}
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
