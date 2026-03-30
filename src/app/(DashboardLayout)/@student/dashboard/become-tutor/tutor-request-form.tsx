"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { requestToBecomeTutorAction } from "@/actions/student-action";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

export default function TutorRequestForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [experienceYrs, setExperienceYrs] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    if (!bio.trim() || bio.trim().length < 10) {
      setError("Bio must be at least 10 characters");
      return;
    }
    const rate = parseFloat(hourlyRate);
    if (isNaN(rate) || rate <= 0) {
      setError("Hourly rate must be a positive number");
      return;
    }
    const exp = parseInt(experienceYrs);
    if (isNaN(exp) || exp < 0) {
      setError("Experience years must be a non-negative number");
      return;
    }

    startTransition(async () => {
      const res = await requestToBecomeTutorAction({
        bio: bio.trim(),
        hourlyRate: rate,
        experienceYrs: exp,
        location: location.trim() || undefined,
        languages: languages.trim() || undefined,
      });

      if (res.success) {
        setSubmitted(true);
        router.refresh();
      } else {
        setError(res.message ?? "Something went wrong");
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="text-lg font-semibold">Application Submitted!</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Your tutor application has been submitted successfully. Our team
          will review it within 24-48 hours. You&apos;ll receive a
          notification once a decision is made.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">
          About You <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about your teaching experience, expertise, and what subjects you'd like to teach… (min 10 characters)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          required
          minLength={10}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {bio.length}/500
        </p>
      </div>

      {/* Rate & Experience */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">
            Hourly Rate (৳) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="hourlyRate"
            type="number"
            min={1}
            step="0.01"
            placeholder="e.g. 500"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceYrs">
            Experience (years) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="experienceYrs"
            type="number"
            min={0}
            placeholder="e.g. 3"
            value={experienceYrs}
            onChange={(e) => setExperienceYrs(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Location & Languages */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Dhaka, Bangladesh"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="languages">Languages</Label>
          <Input
            id="languages"
            placeholder="e.g. Bengali, English"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
        ) : (
          <Send className="h-4 w-4 mr-1" />
        )}
        Submit Application
      </Button>
    </form>
  );
}
