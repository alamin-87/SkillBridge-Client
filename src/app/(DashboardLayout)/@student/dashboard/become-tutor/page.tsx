import { getMyTutorRequestAction } from "@/actions/student-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import TutorRequestForm from "./tutor-request-form";

const statusConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string; description: string }
> = {
  PENDING: {
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    label: "Pending Review",
    description:
      "Your application is being reviewed by our team. You will receive a notification once a decision is made.",
  },
  APPROVED: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    label: "Approved",
    description:
      "Congratulations! Your tutor application has been approved. You can now access the Tutor Dashboard.",
  },
  REJECTED: {
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    color: "bg-red-500/10 text-red-600 border-red-200",
    label: "Rejected",
    description:
      "Unfortunately, your application was not approved at this time.",
  },
};

export default async function BecomeTutorPage() {
  const { data: request } = await getMyTutorRequestAction();

  // If user has an existing request, show status
  if (request) {
    const cfg = statusConfig[request.status] ?? statusConfig.PENDING;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-violet-500" />
            Tutor Application
          </h2>
          <p className="text-sm text-muted-foreground">
            Track the status of your tutor application
          </p>
        </div>

        {/* Status Card */}
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              {cfg.icon}
              <div>
                <CardTitle className="text-lg">Application Status</CardTitle>
                <Badge variant="outline" className={`mt-1 ${cfg.color}`}>
                  {cfg.label}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {cfg.description}
            </p>

            {/* Application Details */}
            <div className="grid gap-3 rounded-lg bg-muted/50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Bio
                </p>
                <p className="text-sm mt-1">{request.bio}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Hourly Rate
                </p>
                <p className="text-sm mt-1 font-semibold">
                  ৳{request.hourlyRate}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Experience
                </p>
                <p className="text-sm mt-1">
                  {request.experienceYrs} year
                  {request.experienceYrs !== 1 ? "s" : ""}
                </p>
              </div>
              {request.location && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-sm mt-1">{request.location}</p>
                </div>
              )}
              {request.languages && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Languages
                  </p>
                  <p className="text-sm mt-1">{request.languages}</p>
                </div>
              )}
              {request.institution && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Institution
                  </p>
                  <p className="text-sm mt-1">{request.institution}</p>
                </div>
              )}
              {request.categories && request.categories.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {request.categories.map((cat: string) => (
                      <Badge key={cat} variant="secondary" className="px-3 py-0.5 bg-violet-500/10 text-violet-600 border-violet-200">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Submitted
                </p>
                <p className="text-sm mt-1">
                  {new Date(request.createdAt).toLocaleDateString(
                    undefined,
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            {/* Rejection reason */}
            {request.status === "REJECTED" && request.rejectionReason && (
              <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-600 mt-0.5">
                    {request.rejectionReason}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // No existing request — show the form
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-violet-500" />
          Become a Tutor
        </h2>
        <p className="text-sm text-muted-foreground">
          Share your expertise and earn by teaching on SkillBridge
        </p>
      </div>

      {/* Benefits */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Flexible Schedule",
            desc: "Set your own availability and teach on your terms",
          },
          {
            title: "Earn Money",
            desc: "Set your hourly rate and receive payments directly",
          },
          {
            title: "Grow Your Network",
            desc: "Connect with students and build your teaching career",
          },
        ].map((b) => (
          <Card key={b.title} className="text-center">
            <CardContent className="pt-6">
              <p className="font-semibold">{b.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {b.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fill in your details below. Our team will review your
            application within 24-48 hours.
          </p>
        </CardHeader>
        <CardContent>
          <TutorRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}
