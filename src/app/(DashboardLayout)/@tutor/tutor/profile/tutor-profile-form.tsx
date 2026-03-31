"use client";

import * as React from "react";
import { updateMyTutorProfileAction } from "@/actions/tutor-action";
import { getCategoriesAction } from "@/actions/category-action";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Save,
  X,
  Mail,
  Phone,
  User,
  Camera,
  Globe,
  Loader2,
  Calendar,
  ShieldCheck,
  MapPin,
  FileCode,
  GraduationCap,
  Banknote,
  Briefcase,
  Languages,
  LayoutDashboard,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";

function initials(name?: string) {
  const n = (name ?? "User").trim();
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function normalizeCategory(name: string) {
  return name.trim().toUpperCase();
}

function prettyCategory(name: string) {
  return name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

type Category = {
  id?: string;
  name: string;
};

function dedupeCategories(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  for (const cat of categories) {
    const key = normalizeCategory(cat.name);
    if (!map.has(key)) {
      map.set(key, { ...cat, name: prettyCategory(cat.name) });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function parseLanguages(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value))
    return value
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  if (typeof value === "string") {
    const s = value.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr))
          return arr
            .map(String)
            .map((x) => x.trim())
            .filter(Boolean);
      } catch {}
    }
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

function languagesTextToArray(text: string): string[] {
  const raw = text
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const l of raw) {
    const key = l.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}

export default function TutorProfileForm({ profile }: { profile: any }) {
  const user = profile?.user;
  const [isEditing, setIsEditing] = React.useState(false);
  const router = useRouter();

  const [bio, setBio] = React.useState(profile?.bio ?? "");
  const [hourlyRate, setHourlyRate] = React.useState(
    String(profile?.hourlyRate ?? ""),
  );
  const [experienceYrs, setExperienceYrs] = React.useState(
    String(profile?.experienceYrs ?? ""),
  );
  const [location, setLocation] = React.useState(profile?.location ?? "");
  const [institution, setInstitution] = React.useState(
    profile?.institution ?? "",
  );
  const [languagesText, setLanguagesText] = React.useState<string>(() => {
    const arr = parseLanguages(profile?.languages);
    return arr.join(", ");
  });
  const [profileImage, setProfileImage] = React.useState(
    (profile?.profileImage ?? "") as string,
  );
  const [useUpload, setUseUpload] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);

  const [allCategories, setAllCategories] = React.useState<Category[]>([]);
  const [catLoading, setCatLoading] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    () => {
      const raw: string[] =
        (profile?.categories
          ?.map((c: any) => c?.category?.name)
          .filter(Boolean) as string[]) ?? [];
      const normalized = Array.from(new Set(raw.map(normalizeCategory)));
      return normalized.slice(0, 2);
    },
  );

  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setCatLoading(true);
      try {
        const res = await getCategoriesAction();
        if (res?.categories) {
          setAllCategories(dedupeCategories(res.categories as Category[]));
        }
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setCatLoading(false);
      }
    })();
  }, []);

  const toggleCategory = (name: string) => {
    const normalized = normalizeCategory(name);
    setSelectedCategories((prev) => {
      if (prev.includes(normalized))
        return prev.filter((x) => x !== normalized);
      if (prev.length >= 2) return prev;
      return [...prev, normalized];
    });
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const languagesStr = languagesTextToArray(languagesText).join(", ");
    const formData = new FormData();
    const payloadData = {
      bio: bio.trim() || undefined,
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      experienceYrs: experienceYrs ? Number(experienceYrs) : undefined,
      location: location.trim() || undefined,
      institution: institution.trim() || undefined,
      languages: languagesStr || undefined,
      profileImage: useUpload ? undefined : profileImage.trim() || undefined,
      categories: selectedCategories,
    };

    formData.append("data", JSON.stringify(payloadData));
    if (useUpload && file) formData.append("profileImage", file);

    const res = await updateMyTutorProfileAction(
      useUpload && file ? formData : payloadData,
    );

    setSaving(false);
    if (res.success) {
      toast.success("Profile updated successfully! ✨");
      const arr = parseLanguages(res.data?.languages);
      setLanguagesText(arr.join(", "));
      setIsEditing(false);
      window.dispatchEvent(new Event("profile-updated"));
      router.refresh();
    } else {
      toast.error(res.message || "Failed to update profile");
    }
  };

  const cancelEdit = () => {
    setBio(profile?.bio ?? "");
    setHourlyRate(String(profile?.hourlyRate ?? ""));
    setExperienceYrs(String(profile?.experienceYrs ?? ""));
    setLocation(profile?.location ?? "");
    setInstitution(profile?.institution ?? "");
    const arr = parseLanguages(profile?.languages);
    setLanguagesText(arr.join(", "));
    setProfileImage(profile?.profileImage ?? "");
    setFile(null);
    setUseUpload(false);
    setIsEditing(false);
  };

  const previewImage =
    useUpload && file ? URL.createObjectURL(file) : profileImage || user?.image;
  const displayName = user?.name ?? "Tutor";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <Card className="overflow-hidden border-none shadow-2xl bg-card/60 backdrop-blur-md">
        <div className="h-40 bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -bottom-16 left-8 p-1.5 rounded-full bg-background border-4 border-background shadow-xl">
            <Avatar className="h-32 w-32 border-2 border-primary/10">
              <AvatarImage
                src={previewImage || undefined}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-bold bg-linear-to-br from-violet-50 to-indigo-50 text-indigo-600 dark:from-violet-950 dark:to-indigo-950 dark:text-indigo-400">
                {initials(displayName)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 hover:scale-110 transition-all shadow-lg active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    setUseUpload(true);
                    setFile(e.target.files?.[0] || null);
                  }}
                />
              </label>
            )}
          </div>
        </div>

        <CardContent className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                  {displayName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-500/20 dark:text-violet-400 px-3 py-0.5 rounded-full font-semibold"
                >
                  Tutor
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 font-medium">
                <Mail className="w-4 h-4 text-primary/60" />
                {user?.email}
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="group border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-full h-11 px-6 shadow-sm"
              >
                <Pencil className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Update Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Engagement Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground">
                  Tutor Status
                </p>
                <div className="flex items-center gap-2 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-emerald-600 capitalize">
                    Verified Tutor
                  </span>
                </div>
              </div>
              <Separator className="bg-primary/5" />
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    Institution
                  </span>
                  <span className="font-bold truncate max-w-[100px]">
                    {institution || "SkillBridge"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Briefcase className="w-4 h-4 text-pink-500" />
                    Experience
                  </span>
                  <span className="font-bold">{experienceYrs} yrs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Banknote className="w-4 h-4 text-emerald-500" />
                    Rate
                  </span>
                  <span className="font-bold text-indigo-600">
                    ৳{hourlyRate}/hr
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start text-xs text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg h-9 cursor-pointer"
                >
                  <a href="/tutor/dashboard">
                    <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                    View Tutor Dashboard
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-orange-500" />
                Teaching Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-2">
                  Subject Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map((c) => (
                      <Badge
                        key={c}
                        variant="secondary"
                        className="bg-indigo-500/10 text-indigo-600 border-indigo-500/10"
                      >
                        {prettyCategory(c)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      None set
                    </span>
                  )}
                </div>
              </div>
              <Separator className="bg-primary/5" />
              <div>
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-2">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2 text-sm font-bold text-foreground">
                  {languagesText || "English"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2 shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-primary/5 bg-muted/5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              Professional Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {isEditing ? (
              <form
                onSubmit={onSave}
                className="space-y-6 animate-in slide-in-from-bottom-4 duration-500"
              >
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <GraduationCap className="w-3 h-3" /> Professional Bio
                  </Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={6}
                    className="bg-muted/20 border-primary/10 focus-visible:ring-indigo-500/30 rounded-xl leading-relaxed"
                    placeholder="Write something amazing about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">
                      Hourly Rate (৳)
                    </Label>
                    <Input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="h-12 bg-muted/20 border-primary/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">
                      Experience (Years)
                    </Label>
                    <Input
                      type="number"
                      value={experienceYrs}
                      onChange={(e) => setExperienceYrs(e.target.value)}
                      className="h-12 bg-muted/20 border-primary/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">
                      Institution
                    </Label>
                    <Input
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="h-12 bg-muted/20 border-primary/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">
                      Location
                    </Label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 bg-muted/20 border-primary/10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">
                    Languages (Comma separated)
                  </Label>
                  <Input
                    value={languagesText}
                    onChange={(e) => setLanguagesText(e.target.value)}
                    className="h-12 bg-muted/20 border-primary/10 rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">
                    Categories (Max 2)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.name)}
                        className={`p-2 rounded-lg border text-xs transition-all ${selectedCategories.includes(normalizeCategory(cat.name)) ? "bg-indigo-500 text-white border-indigo-500" : "bg-muted/10 border-primary/10 hover:border-primary/20"}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-primary/5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="h-11 px-6 rounded-full font-bold"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-8 rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Profile
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                    About You
                  </p>
                  <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap italic">
                    &quot;
                    {bio || "Experienced tutor sharing knowledge with passion."}
                    &quot;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                      Professional Background
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-violet-500/5">
                        <GraduationCap className="w-5 h-5 text-violet-500" />
                      </div>
                      <p className="font-bold">
                        {institution || "Education Expert"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                      Current Base
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-500/5">
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="font-bold">
                        {location || "Online / Bangladesh"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/5" />

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileCode className="w-3 h-3" /> Tutor ID
                  </p>
                  <code className="text-[11px] bg-muted/30 p-4 rounded-xl block border border-primary/5 font-mono text-muted-foreground">
                    {profile?.id}
                  </code>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
