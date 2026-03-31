"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requestToBecomeTutorAction } from "@/actions/student-action";
import { getCategoriesAction } from "@/actions/category-action";
import { Loader2, Send, CheckCircle2, GraduationCap, Globe, BookOpen, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  const [institution, setInstitution] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [catLoading, setCatLoading] = useState(true);

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
      if (prev.length >= 2) return prev; // Limit to 2
      return [...prev, name];
    });
  }

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

    if (selectedCategories.length === 0) {
        setError("Please select at least one teaching category");
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

      const res = await requestToBecomeTutorAction(payload);

      if (res.success) {
        setSubmitted(true);
        toast.success("Application submitted! ✨");
        router.refresh();
      } else {
        setError(res.message ?? "Something went wrong");
        toast.error(res.message || "Something went wrong");
      }
    });
  }

  if (submitted) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center gap-4 py-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
           <div className="bg-emerald-500 p-3 rounded-full shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-white" />
           </div>
           <div className="text-center">
              <h3 className="text-2xl font-bold text-emerald-600">Application Submitted!</h3>
              <p className="text-muted-foreground text-sm">Your tutor request is currently under review.</p>
           </div>
        </div>

        <Card className="shadow-xl border-primary/5 overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
             <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                <BookOpen className="w-5 h-5" />
                Submitted Application Details
             </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-2">
                   <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest">Main Bio</p>
                   <p className="text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground/60">Hourly Rate</p>
                        <p className="font-bold text-indigo-600">৳{hourlyRate}/hr</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground/60">Experience</p>
                        <p className="font-bold text-indigo-600">{experienceYrs} Years</p>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground/60">Institution</p>
                      <p className="font-bold flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-pink-500" />
                        {institution || "Not provided"}
                      </p>
                   </div>
                </div>
             </div>

             <Separator className="bg-primary/5" />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest">Teaching Categories</p>
                   <div className="flex flex-wrap gap-2">
                      {selectedCategories.map(cat => (
                        <Badge key={cat} className="bg-indigo-600 px-4 py-1">{cat}</Badge>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest">Contact & Preferences</p>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-muted-foreground">Location:</span>
                        <span className="font-bold">{location || "Online"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-muted-foreground">Languages:</span>
                        <span className="font-bold">{languages || "Not specified"}</span>
                      </div>
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
           <Button variant="link" onClick={() => router.push("/dashboard")} className="text-indigo-600 font-bold hover:scale-105 transition-transform">
              Return to Student Dashboard
           </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      {/* Bio */}
      <div className="space-y-3">
        <Label htmlFor="bio" className="text-base font-bold flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          Teaching Experience & About You <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="bio"
          placeholder="Share your teaching philosophy, expertise, and what makes you a great tutor..."
          className="min-h-[120px] bg-muted/20 border-primary/10 transition-all focus:border-indigo-500 rounded-xl"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          minLength={10}
          maxLength={500}
        />
        <p className="text-[10px] text-muted-foreground text-right font-mono">
          {bio.length}/500 characters
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Hourly Rate */}
        <div className="space-y-3">
          <Label htmlFor="hourlyRate" className="text-base font-bold">
            Target Hourly Rate (৳) <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">৳</span>
            <Input
              id="hourlyRate"
              type="number"
              min={1}
              step="1"
              placeholder="e.g. 800"
              className="pl-8 h-12 bg-muted/20 border-primary/10 rounded-xl focus:ring-indigo-500/30"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Experience Yrs */}
        <div className="space-y-3">
          <Label htmlFor="experienceYrs" className="text-base font-bold">
            Total Years of Experience <span className="text-red-500">*</span>
          </Label>
          <Input
            id="experienceYrs"
            type="number"
            min={0}
            placeholder="e.g. 5"
            className="h-12 bg-muted/20 border-primary/10 rounded-xl focus:ring-indigo-500/30"
            value={experienceYrs}
            onChange={(e) => setExperienceYrs(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Institution */}
      <div className="space-y-3">
        <Label htmlFor="institution" className="text-base font-bold flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-pink-500" />
          University / Institution
        </Label>
        <Input
          id="institution"
          placeholder="e.g. Dhaka University"
          className="h-12 bg-muted/20 border-primary/10 rounded-xl focus:ring-indigo-500/30"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Geography */}
        <div className="space-y-3">
          <Label htmlFor="location" className="text-base font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Preferred Tutoring Location
          </Label>
          <Input
            id="location"
            placeholder="e.g. Online / Banani, Dhaka"
            className="h-12 bg-muted/20 border-primary/10 rounded-xl focus:ring-indigo-500/30"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <Label htmlFor="languages" className="text-base font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-500" />
            Languages
          </Label>
          <Input
            id="languages"
            placeholder="e.g. English, Bengali"
            className="h-12 bg-muted/20 border-primary/10 rounded-xl focus:ring-indigo-500/30"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Selection */}
      <div className="space-y-4">
        <Label className="text-base font-bold flex items-center gap-2">
          <Badge className="bg-indigo-600">Categories (Max 2)</Badge>
          Which subjects can you teach? <span className="text-red-500">*</span>
        </Label>
        
        {catLoading ? (
            <div className="flex items-center gap-2 py-4 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Syncing categories with admin...</span>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableCategories.map((cat) => {
                    const selected = selectedCategories.includes(cat.name);
                    const disabled = !selected && selectedCategories.length >= 2;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => toggleCategory(cat.name)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all text-left ${
                                selected 
                                    ? "bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500 text-indigo-700 dark:text-indigo-400 font-bold" 
                                    : "bg-muted/10 border-primary/10 hover:border-primary/30"
                            } ${disabled ? "opacity-50 cursor-not-allowed grayscale-[0.5]" : ""}`}
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected ? "bg-indigo-600 border-indigo-600" : "border-primary/30"}`}>
                                {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <span className="truncate">{cat.name}</span>
                        </button>
                    )
                })}
            </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-2 animate-shake">
          <span>⚠</span> {error}
        </div>
      )}

      <div className="pt-6 border-t border-primary/5">
        <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full sm:w-auto h-12 px-10 rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all text-white"
        >
            {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
            <Send className="h-5 w-5 mr-2" />
            )}
            Submit Professional Application
        </Button>
      </div>
    </form>
  );
}


