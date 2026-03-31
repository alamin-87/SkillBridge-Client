import { getAdminAssignmentsAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, User, Calendar } from "lucide-react";
import AssignmentDeleteButton from "./assignment-delete-button";

const statusBadge: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200",
  SUBMITTED: "bg-blue-500/10 text-blue-600 border-blue-200",
  GRADED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
};

export default async function AdminAssignmentsPage() {
  const { data: assignments } = await getAdminAssignmentsAction();
  const allAssignments = Array.isArray(assignments) ? assignments : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-pink-500" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Assignment Management</h2>
            <p className="text-sm text-muted-foreground">
              {allAssignments.length} assignments created by tutors
            </p>
          </div>
        </div>

        <Button asChild size="sm" variant="outline">
          <a href="/admin">
            <User className="h-3.5 w-3.5 mr-1" />
            Dashboard
          </a>
        </Button>
      </div>

      {allAssignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No assignments found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {allAssignments.map((assignment: any) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {assignment.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {assignment.description || "No description provided"}
                    </p>
                  </div>
                  <AssignmentDeleteButton assignmentId={assignment.id} />
                </div>
              </CardHeader>
              <CardContent className="pt-4 grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <User className="h-3 w-3" />
                    Created By
                  </div>
                  <div>
                    <p className="text-sm font-medium">{assignment.createdBy?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{assignment.createdBy?.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Calendar className="h-3 w-3" />
                    Details
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusBadge[assignment.status] ?? ""}>
                        {assignment.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {assignment.submissions?.length || 0} Submissions
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(assignment.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <BookOpen className="h-3 w-3" />
                    Tied To
                  </div>
                  {assignment.booking ? (
                    <div>
                      <p className="text-sm font-medium">Class with {assignment.booking.student?.name}</p>
                      <p className="text-xs text-muted-foreground">Booking ID: {assignment.booking.id.slice(0, 8)}...</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Public Assignment</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
