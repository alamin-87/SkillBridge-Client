"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { requestToBecomeTutorAction, updateTutorRequestAction } from "@/actions/student-action";
import { getCategoriesAction } from "@/actions/category-action";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getIconComponent } from "@/lib/icon-mapper";

interface TutorRequestFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export default function TutorRequestForm({ initialData, onSuccess }: TutorRequestFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [bio, setBio] = useState(initialData?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(initialData?.hourlyRate?.toString() || "");
  const [experienceYrs, setExperienceYrs] = useState(initialData?.experienceYrs?.toString() || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [languages, setLanguages] = useState(initialData?.languages || "");
  const [institution, setInstitution] = useState(initialData?.institution || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categories || []);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  // Icons
  const BookOpenIcon = getIconComponent("BookOpen");
  const BriefcaseIcon = getIconComponent("Briefcase");
  const SparklesIcon = getIconComponent("Sparkles");
  const AlertTriangleIcon = getIconComponent("AlertTriangle");
  const SendIcon = getIconComponent("Send");
  const RefreshIcon = getIconComponent("RefreshCw");
  const CheckIcon = getIconComponent("Check");
  const DollarIcon = getIconComponent("DollarSign");
  const TrophyIcon = getIconComponent("Trophy");
  const GraduationCapIcon = getIconComponent("GraduationCap");
  const MapPinIcon = getIconComponent("MapPin");
  const GlobeIcon = getIconComponent("Globe");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategoriesAction();
        if (!res.error) {
          setAvailableCategories(res.categories || []);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setCatLoading(false);
      }
    }
    loadCategories();
  }, []);

  function toggleCategory(name: string) {
    setSelectedCategories(prev => {
      const exists = prev.includes(name);
      if (exists) return prev.filter(c => c !== name);
      if (prev.length >= 2) return prev;
      return [...prev, name];
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!bio.trim() || bio.trim().length < 10) {
      setError("Bio must be at least 10 characters.");
      return;
    }
    const rate = parseFloat(hourlyRate);
    if (isNaN(rate) || rate <= 0) {
      setError("Hourly rate must be a positive number.");
      return;
    }
    const exp = parseInt(experienceYrs);
    if (isNaN(exp) || exp < 0) {
      setError("Experience years must be a non-negative number.");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Please select at least one teaching subject.");
      return;
    }

    startTransition(async () => {
      const payload = {
        bio: bio.trim(),
        hourlyRate: rate,
        experienceYrs: exp,
        location: location.trim() || undefined,
        languages: languages.trim() || undefined,
        institution: institution.trim() || undefined,
        categories: selectedCategories,
      };

      const res = initialData
        ? await updateTutorRequestAction(payload)
        : await requestToBecomeTutorAction(payload);

      if (res.success) {
        toast.success(initialData ? "Application updated successfully!" : "Application submitted! 🎉");
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        setError(res.message ?? "Something went wrong.");
        toast.error(res.message || "Something went wrong.");
      }
    });
  }

  const inputBaseClass =
    "w-full h-12 rounded-xl bg-background border border-input px-4 text-sm font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all";

  return (
    <form onSubmit={handleSubmit} className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">

      {/* ── Section 1: Teaching Bio ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpenIcon className="w-[18px] h-[18px] text-primary" />
          </div>
          <div>
            <Label htmlFor="bio" className="text-base font-bold">Teaching Bio</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Describe your teaching style and what makes you a great tutor.</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">About You</span>
            <span className={`text-[11px] font-medium tabular-nums ${bio.length > 450 ? 'text-amber-500' : 'text-muted-foreground/60'}`}>
              {bio.length}/500
            </span>
          </div>
          <textarea
            id="bio"
            placeholder="I have a passion for teaching and believe in hands-on, project-based learning. My students learn best through real-world examples..."
            className="w-full min-h-[140px] rounded-xl bg-background border border-input px-4 py-3.5 text-sm font-medium leading-relaxed placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            minLength={10}
            maxLength={500}
          />
        </div>
      </div>

      <Separator />

      {/* ── Section 2: Professional Details ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <BriefcaseIcon className="w-[18px] h-[18px] text-primary" />
          </div>
          <div>
            <Label className="text-base font-bold">Professional Details</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Your rates, experience, and credentials.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 px-1">
              <DollarIcon className="w-3 h-3" /> Hourly Rate (৳) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">৳</span>
              <input
                id="hourlyRate"
                type="number"
                placeholder="500"
                className={`${inputBaseClass} pl-9`}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experienceYrs" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 px-1">
              <TrophyIcon className="w-3 h-3" /> Experience (Years) <span className="text-destructive">*</span>
            </Label>
            <input
              id="experienceYrs"
              type="number"
              placeholder="3"
              className={inputBaseClass}
              value={experienceYrs}
              onChange={(e) => setExperienceYrs(e.target.value)}
              required
            />
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="institution" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 px-1">
              <GraduationCapIcon className="w-3 h-3" /> Institution / Organization
            </Label>
            <input
              id="institution"
              placeholder="e.g. University of Dhaka"
              className={inputBaseClass}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 px-1">
              <MapPinIcon className="w-3 h-3" /> Location
            </Label>
            <input
              id="location"
              placeholder="e.g. Dhaka, Bangladesh"
              className={inputBaseClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Languages — full width */}
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="languages" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 px-1">
              <GlobeIcon className="w-3 h-3" /> Languages
            </Label>
            <input
              id="languages"
              placeholder="e.g. Bangla, English, Hindi"
              className={inputBaseClass}
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Section 3: Teaching Subjects ── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <SparklesIcon className="w-[18px] h-[18px] text-primary" />
            </div>
            <div>
              <Label className="text-base font-bold">Teaching Subjects</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Choose up to 2 subjects you want to teach.</p>
            </div>
          </div>
          <Badge variant="secondary" className="rounded-lg font-bold text-xs tabular-nums">
            {selectedCategories.length} / 2
          </Badge>
        </div>

        {catLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-20 bg-muted rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableCategories.map((cat) => {
              const selected = selectedCategories.includes(cat.name);
              const disabled = !selected && selectedCategories.length >= 2;
              const CatIcon = getIconComponent(cat.icon || cat.name);

              return (
                <button
                  key={cat.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleCategory(cat.name)}
                  className={`
                    relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 group
                    ${selected
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-background border-input hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm"
                    }
                    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"}
                  `}
                >
                  <div className={`
                    h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                    ${selected
                      ? "bg-white/20"
                      : "bg-muted group-hover:bg-primary/10"
                    }
                  `}>
                    <CatIcon className={`w-5 h-5 ${selected ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
                  </div>

                  <div className="min-w-0">
                    <span className={`text-sm font-semibold truncate block ${selected ? "text-white" : ""}`}>
                      {cat.name}
                    </span>
                    <span className={`text-[10px] font-medium ${selected ? "text-white/60" : "text-muted-foreground/60"}`}>
                      {selected ? "Selected" : "Subject"}
                    </span>
                  </div>

                  {/* Checkmark */}
                  {selected && (
                    <div className="absolute top-2 right-2 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-sm animate-in zoom-in duration-200">
                      <CheckIcon className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Error Message ── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-in slide-in-from-top-1 duration-300">
          <div className="h-8 w-8 bg-destructive rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangleIcon className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm font-medium text-destructive flex-1">{error}</p>
        </div>
      )}

      {/* ── Submit Button ── */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full h-14 rounded-xl font-bold text-base gap-2.5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
        >
          {isPending ? (
            <div className="h-5 w-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
          ) : initialData ? (
            <RefreshIcon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <SendIcon className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
          )}
          {isPending
            ? "Submitting..."
            : initialData
              ? "Update Application"
              : "Submit Application"
          }
        </Button>
        <p className="text-center text-[11px] text-muted-foreground/60 mt-3 font-medium">
          Your application will be reviewed within 2–3 business days.
        </p>
      </div>
    </form>
  );
}
