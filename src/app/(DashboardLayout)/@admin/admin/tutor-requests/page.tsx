import { getTutorRequestsAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";
import TutorRequestActions from "./tutor-request-actions";

const statusBadge: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200",
  APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200",
};

const statusIcon: Record<string, React.ReactNode> = {
  PENDING: <Clock className="h-4 w-4 text-amber-500" />,
  APPROVED: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  REJECTED: <XCircle className="h-4 w-4 text-red-500" />,
};

export default async function AdminTutorRequestsPage() {
  const { data: requests } = await getTutorRequestsAction();

  const allRequests = Array.isArray(requests) ? requests : [];
  const pending = allRequests.filter((r: any) => r.status === "PENDING");
  const approved = allRequests.filter((r: any) => r.status === "APPROVED");
  const rejected = allRequests.filter((r: any) => r.status === "REJECTED");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-5 w-5 text-violet-500" />
          Tutor Requests
        </h2>
        <p className="text-sm text-muted-foreground">
          Review and manage tutor applications
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pending.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{approved.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{rejected.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Request List */}
      {allRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No tutor requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allRequests.map((req: any) => (
            <Card
              key={req.id}
              className="transition-colors hover:bg-muted/30"
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Applicant info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">
                        {req.user?.name ?? "Unknown"}
                      </p>
                      <span className="text-sm text-muted-foreground">
                        {req.user?.email}
                      </span>
                      <Badge
                        variant="outline"
                        className={statusBadge[req.status] ?? ""}
                      >
                        {statusIcon[req.status]} {req.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {req.bio}
                    </p>

                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>
                        <strong>Rate:</strong> ৳{req.hourlyRate}/hr
                      </span>
                      <span>
                        <strong>Experience:</strong> {req.experienceYrs} yr
                        {req.experienceYrs !== 1 ? "s" : ""}
                      </span>
                      {req.location && (
                        <span>
                          <strong>Location:</strong> {req.location}
                        </span>
                      )}
                      {req.languages && (
                        <span>
                          <strong>Languages:</strong> {req.languages}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Applied{" "}
                      {new Date(req.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {req.status === "REJECTED" && req.rejectionReason && (
                      <p className="text-xs text-red-500">
                        Rejection: {req.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  {req.status === "PENDING" && (
                    <TutorRequestActions requestId={req.id} />
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
