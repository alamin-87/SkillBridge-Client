"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createMyTutorProfileAction } from "@/actions/tutor-action";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Category = {
  id?: string;
  name: string;
};

function normalizeCategory(name: string) {
  return name.trim().toUpperCase();
}
function prettyCategory(name: string) {
  return name
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
function dedupeCategories(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  for (const cat of categories) {
    const key = normalizeCategory(cat.name);
    if (!map.has(key)) map.set(key, { ...cat, name: prettyCategory(cat.name) });
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default function TutorCreateProfileForm({
  serverCategories,
}: {
  serverCategories: Category[];
}) {
  const router = useRouter();

  const [bio, setBio] = React.useState("");
  const [hourlyRate, setHourlyRate] = React.useState("");
  const [experienceYrs, setExperienceYrs] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [languagesText, setLanguagesText] = React.useState("");
  const [profileImage, setProfileImage] = React.useState("");

  const [allCategories] = React.useState<Category[]>(
    dedupeCategories(serverCategories ?? []),
  );
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  const [saving, setSaving] = React.useState(false);
  const [created, setCreated] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const toggleCategory = (name: string) => {
    const normalized = normalizeCategory(name);
    setSelectedCategories((prev) => {
      const exists = prev.includes(normalized);
      if (exists) return prev.filter((x) => x !== normalized);
      if (prev.length >= 2) return prev;
      return [...prev, normalized];
    });
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Already created: go edit page
    if (created) {
      setMsg("Profile already created. Redirecting to edit...");
      router.push("/tutor/profile"); // ✅ edit profile page
      router.refresh();
      return;
    }

    setSaving(true);
    setMsg(null);

    const res = await createMyTutorProfileAction({
      bio: bio.trim() || undefined,
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      experienceYrs: experienceYrs ? Number(experienceYrs) : undefined,
      location: location.trim() || undefined,
      languages: languagesText.trim() || undefined,
      profileImage: profileImage.trim() ? profileImage.trim() : null,
      categories: selectedCategories,
    });

    setSaving(false);

    if (res.success) {
      setCreated(true);
      setMsg("Profile created ✅ Redirecting to edit profile...");

      // ✅ auto-redirect to edit profile
      router.push("/tutor/profile");
      router.refresh();
    } else {
      setMsg(res.error?.message ?? "Create failed ❌");
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Create Tutor Profile</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in your tutor profile information.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={onCreate} className="space-y-4">
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
            <Label>Languages</Label>
            <Input
              value={languagesText}
              onChange={(e) => setLanguagesText(e.target.value)}
              placeholder="English, Bangla"
            />
            <p className="text-xs text-muted-foreground">
              Separate languages using comma.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Categories (select max 2)</Label>

            <div className="rounded-md border p-3">
              <div className="mb-2 flex flex-wrap gap-2">
                {selectedCategories.length ? (
                  selectedCategories.map((c) => (
                    <Badge key={c} variant="secondary">
                      {prettyCategory(c)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No categories selected
                  </span>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {allCategories.map((cat) => {
                  const normalizedName = normalizeCategory(cat.name);
                  const checked = selectedCategories.includes(normalizedName);
                  const disabled = !checked && selectedCategories.length >= 2;

                  return (
                    <label
                      key={cat.id ?? cat.name}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                        disabled ? "opacity-50" : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleCategory(cat.name)}
                      />
                      <span className="truncate">{cat.name}</span>
                    </label>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                You can select up to <span className="font-medium">2</span>{" "}
                categories.
              </p>
            </div>
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
              {saving ? "Creating..." : created ? "Go to Edit Profile" : "Create profile"}
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
