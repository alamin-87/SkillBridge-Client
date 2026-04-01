"use client";

import { getMyTutorRequestAction, cancelTutorRequestAction } from "@/actions/student-action";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/icon-mapper";
import TutorRequestForm from "./tutor-request-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusConfig: Record<
  string,
  { iconName: string; badgeClass: string; label: string; description: string; accentClass: string; dotClass: string }
> = {
  PENDING: {
    iconName: "Clock",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-500/25",
    accentClass: "from-amber-500/10 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/5",
    dotClass: "bg-amber-500",
    label: "Pending Review",
    description:
      "Your application is being reviewed by our team. We'll notify you once a decision has been made.",
  },
  APPROVED: {
    iconName: "CheckCircle2",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25",
    accentClass: "from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/5",
    dotClass: "bg-emerald-500",
    label: "Approved",
    description:
      "Congratulations! Your tutor application has been approved. You can now start teaching on SkillBridge.",
  },
  REJECTED: {
    iconName: "XCircle",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-200 dark:border-red-500/25",
    accentClass: "from-red-500/10 to-rose-500/5 dark:from-red-500/10 dark:to-rose-500/5",
    dotClass: "bg-red-500",
    label: "Needs Revision",
    description:
      "Your application wasn't approved this time. Please review the feedback below and resubmit.",
  },
};

export default function BecomeTutorPage() {
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const fetchRequest = async () => {
    setLoading(true);
    const { data } = await getMyTutorRequestAction();
    setRequest(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to withdraw your application? This cannot be undone.")) return;
    setIsCancelling(true);
    const res = await cancelTutorRequestAction();
    if (res.success) {
      toast.success("Application withdrawn successfully");
      setRequest(null);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsCancelling(false);
  };

  // Icons
  const GraduationCapIcon = getIconComponent("GraduationCap");
  const ArrowLeftIcon = getIconComponent("ArrowLeft");
  const EditIcon = getIconComponent("Edit3");
  const TrashIcon = getIconComponent("Trash2");
  const BriefcaseIcon = getIconComponent("Briefcase");
  const MapPinIcon = getIconComponent("MapPin");
  const DollarIcon = getIconComponent("DollarSign");
  const AwardIcon = getIconComponent("Award");
  const AlertCircleIcon = getIconComponent("AlertCircle");
  const SparklesIcon = getIconComponent("Sparkles");
  const UsersIcon = getIconComponent("Users");
  const ShieldCheckIcon = getIconComponent("ShieldCheck");
  const ZapIcon = getIconComponent("Zap");
  const TrophyIcon = getIconComponent("Trophy");
  const BookOpenIcon = getIconComponent("BookOpen");

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
          <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Loading application...</p>
      </div>
    );
  }

  /* ─── Edit Mode ─── */
  if (isEditing && request) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <EditIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Edit Application</h2>
              <p className="text-sm text-muted-foreground">Update your tutor profile details</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="rounded-xl gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className="rounded-2xl border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <TutorRequestForm
              initialData={request}
              onSuccess={() => {
                setIsEditing(false);
                fetchRequest();
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ─── Existing Application Tracker ─── */
  if (request) {
    const cfg = statusConfig[request.status] ?? statusConfig.PENDING;
    const StatusIcon = getIconComponent(cfg.iconName);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCapIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Tutor Application</h2>
              <p className="text-sm text-muted-foreground">Track your application status</p>
            </div>
          </div>

          {(request.status === "PENDING" || request.status === "REJECTED") && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-2"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Withdraw
              </Button>
            </div>
          )}
        </div>

        {/* Status Banner */}
        <Card className={`rounded-2xl border overflow-hidden shadow-sm`}>
          <div className={`bg-linear-to-r ${cfg.accentClass} p-6`}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-background shadow-sm flex items-center justify-center shrink-0 border">
                <StatusIcon className="h-6 w-6 text-foreground" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold">Application Status</h3>
                  <Badge variant="outline" className={`${cfg.badgeClass} font-semibold text-xs rounded-lg px-2.5 py-0.5`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass} mr-1.5 inline-block`} />
                    {cfg.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                  {cfg.description}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Application Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarIcon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wide">Hourly Rate</span>
                </div>
                <p className="text-xl font-bold">৳{request.hourlyRate}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BriefcaseIcon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wide">Experience</span>
                </div>
                <p className="text-xl font-bold">{request.experienceYrs} <span className="text-sm font-medium text-muted-foreground">years</span></p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AwardIcon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wide">Institution</span>
                </div>
                <p className="text-sm font-semibold truncate">{request.institution || "Not specified"}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wide">Location</span>
                </div>
                <p className="text-sm font-semibold truncate">{request.location || "Not specified"}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Categories */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpenIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">Teaching Subjects</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.categories?.map((cat: string) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="px-3 py-1.5 rounded-lg font-semibold text-sm"
                  >
                    {cat}
                  </Badge>
                )) || (
                  <p className="text-sm text-muted-foreground italic">No subjects selected</p>
                )}
              </div>
            </div>

            {/* Bio */}
            {request.bio && (
              <>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UsersIcon className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Teaching Bio</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed bg-muted/50 rounded-xl p-4 border">
                    {request.bio}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Rejection Feedback */}
          {request.status === "REJECTED" && request.rejectionReason && (
            <>
              <Separator />
              <div className="p-6">
                <div className="flex gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/15">
                  <AlertCircleIcon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-destructive">Reviewer Feedback</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      {request.rejectionReason}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  /* ─── New Application: Welcome + Form ─── */
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-5 pt-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full">
          <SparklesIcon className="h-3.5 w-3.5" />
          Become an Instructor
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
          Share Your Knowledge,<br />
          <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Inspire Students
          </span>
        </h1>

        <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
          Join our community of expert tutors. Set your own rates, choose your subjects, and start teaching students who need your expertise.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Flexible Schedule",
            desc: "Set your own availability and teach on your terms with fully customizable time slots.",
            Icon: ZapIcon,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
          {
            title: "Verified Profile",
            desc: "Earn a verified instructor badge that builds trust and attracts more students.",
            Icon: ShieldCheckIcon,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            title: "Competitive Earnings",
            desc: "Set your own hourly rates with transparent pricing. Get paid directly for every session.",
            Icon: TrophyIcon,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
          },
        ].map((feature) => (
          <Card
            key={feature.title}
            className="rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
          >
            <CardContent className="p-6 space-y-3">
              <div className={`h-10 w-10 rounded-xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <feature.Icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-base">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Form Card */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Panel — Info */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 p-8 lg:p-10 text-white flex flex-col gap-8">
            <div className="space-y-6">
              <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <GraduationCapIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold leading-snug">Apply to Teach</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Fill out the form to submit your tutor application. Our team will review it within 2–3 business days.
                </p>
              </div>
            </div>

            <Separator className="bg-white/15" />

            <div className="space-y-5">
              {[
                { num: "1", label: "Your Bio", sub: "Tell students about your teaching style" },
                { num: "2", label: "Experience", sub: "Your qualifications and rates" },
                { num: "3", label: "Subjects", sub: "Choose what you want to teach" },
              ].map((step) => (
                <div key={step.num} className="flex gap-3 items-start group">
                  <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold shrink-0 border border-white/15 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300">
                    {step.num}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-xs text-white/50">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel — Form */}
          <div className="lg:col-span-8 bg-card">
            <TutorRequestForm />
          </div>
        </div>
      </Card>
    </div>
  );
}
