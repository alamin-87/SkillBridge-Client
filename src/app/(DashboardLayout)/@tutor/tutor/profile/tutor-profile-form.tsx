"use client";

import * as React from "react";
import { updateMyTutorProfileAction } from "@/actions/tutor-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

function initials(name?: string) {
  const n = (name ?? "User").trim();
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function parseCommaList(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function TutorProfileForm({ profile }: { profile: any }) {
  const user = profile?.user;

  const [bio, setBio] = React.useState(profile?.bio ?? "");
  const [hourlyRate, setHourlyRate] = React.useState(
    String(profile?.hourlyRate ?? ""),
  );
  const [experienceYrs, setExperienceYrs] = React.useState(
    String(profile?.experienceYrs ?? ""),
  );
  const [location, setLocation] = React.useState(profile?.location ?? "");

  // languages stored as CSV string in DB
  const [languages, setLanguages] = React.useState(() => {
    if (typeof profile?.languages === "string") return profile.languages;
    if (Array.isArray(profile?.languages)) return profile.languages.join(", ");
    return "";
  });

  const [profileImage, setProfileImage] = React.useState(
    profile?.profileImage ?? "",
  );

  // ✅ Categories: backend returns include { categories: [{ category: { name } }] }
  const [categories, setCategories] = React.useState(() => {
    const names =
      profile?.categories?.map((c: any) => c?.category?.name).filter(Boolean) ??
      [];
    return names.join(", ");
  });

  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const langs = parseCommaList(languages);
    const cats = parseCommaList(categories);

    const res = await updateMyTutorProfileAction({
      bio: bio.trim() || undefined,
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      experienceYrs: experienceYrs ? Number(experienceYrs) : undefined,
      location: location.trim() || undefined,
      languages: langs, // backend will stringify if needed
      profileImage: profileImage.trim() ? profileImage.trim() : null,
      categories: cats, // ✅ add categories by name
    });

    setSaving(false);
    setMsg(res.success ? "Profile updated ✅" : "Update failed ❌");
  };

  const avatarSrc = profileImage?.trim() || user?.image || "";
  const displayName = user?.name ?? "Tutor";

  const categoryPreview = React.useMemo(
    () => parseCommaList(categories).slice(0, 10),
    [categories],
  );

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Tutor profile</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your bio, rate, experience, languages, and categories.
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border">
            <AvatarImage src={avatarSrc || undefined} alt={displayName} />
            <AvatarFallback>{initials(displayName)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-semibold">{user?.email ?? ""}</p>
            <p className="text-xs text-muted-foreground">
              Role: {user?.role ?? "TUTOR"}
            </p>
          </div>
        </div>

        <form onSubmit={onSave} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Hourly rate</Label>
              <Input
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="e.g. 500"
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2">
              <Label>Experience (years)</Label>
              <Input
                value={experienceYrs}
                onChange={(e) => setExperienceYrs(e.target.value)}
                placeholder="e.g. 3"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dhaka"
            />
          </div>

          <div className="space-y-2">
            <Label>Languages (comma separated)</Label>
            <Input
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="English, Bangla"
            />
          </div>

          {/* ✅ Categories */}
          <div className="space-y-2">
            <Label>Categories (comma separated max 2)</Label>
            <Input
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="Math, Physics, IELTS"
            />

            {categoryPreview.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {categoryPreview.map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Example: <span className="font-medium">Math, React, English</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Profile image URL</Label>
            <Input
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            {msg ? (
              <span className="text-sm text-muted-foreground">{msg}</span>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
