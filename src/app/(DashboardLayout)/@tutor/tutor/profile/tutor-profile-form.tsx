"use client";

import * as React from "react";
import { updateMyTutorProfileAction } from "@/actions/tutor-action";
import { getCategoriesAction } from "@/actions/category-action";

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

// ✅ normalize categories for comparisons + backend payload
function normalizeCategory(name: string) {
  return name.trim().toUpperCase();
}

// ✅ nicer UI label
function prettyCategory(name: string) {
  return name
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type Category = {
  id?: string;
  name: string;
};

// ✅ remove duplicates in category list (math/Math/MATH => one)
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

/** ✅ Robust language parser: handles array | JSON string | comma string */
function parseLanguages(value: any): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const s = value.trim();

    // JSON string: '["English","Bangla"]'
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) {
          return arr.map(String).map((x) => x.trim()).filter(Boolean);
        }
      } catch {
        // ignore
      }
    }

    // comma-separated fallback
    return s.split(",").map((x) => x.trim()).filter(Boolean);
  }

  return [];
}

/**
 * ✅ Convert UI string "English, Bangla" -> ["English","Bangla"]
 * - split by comma ONLY
 * - removes duplicates (case-insensitive)
 */
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

  const [bio, setBio] = React.useState(profile?.bio ?? "");
  const [hourlyRate, setHourlyRate] = React.useState(
    String(profile?.hourlyRate ?? ""),
  );
  const [experienceYrs, setExperienceYrs] = React.useState(
    String(profile?.experienceYrs ?? ""),
  );
  const [location, setLocation] = React.useState(profile?.location ?? "");

  /**
   * ✅ IMPORTANT:
   * UI must ALWAYS keep languages as a STRING, never array.
   * So we convert to array -> join(", ") here.
   */
  const [languagesText, setLanguagesText] = React.useState<string>(() => {
    const arr = parseLanguages(profile?.languages);
    return arr.join(", "); // ✅ "English, Bangla"
  });

  const [profileImage, setProfileImage] = React.useState(
    (profile?.profileImage ?? "") as string,
  );

  // ✅ categories from server action (deduped for UI)
  const [allCategories, setAllCategories] = React.useState<Category[]>([]);
  const [catLoading, setCatLoading] = React.useState(false);
  const [catError, setCatError] = React.useState<string | null>(null);

  // ✅ selected categories stored as UPPERCASE, max 2, deduped
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    (): string[] => {
      const raw: string[] =
        (profile?.categories
          ?.map((c: any) => c?.category?.name)
          .filter(Boolean) as string[]) ?? [];

      const normalized = Array.from(new Set(raw.map(normalizeCategory)));
      return normalized.slice(0, 2);
    },
  );

  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  // ✅ load categories on mount + dedupe
  React.useEffect(() => {
    let mounted = true;

    (async () => {
      setCatLoading(true);
      setCatError(null);
      try {
        const res = await getCategoriesAction();
        if (!mounted) return;

        if (res?.error) {
          setAllCategories([]);
          setCatError(res.error);
        } else {
          const raw = (res.categories ?? []) as Category[];
          setAllCategories(dedupeCategories(raw));
        }
      } catch {
        if (!mounted) return;
        setAllCategories([]);
        setCatError("Failed to load categories");
      } finally {
        if (!mounted) return;
        setCatLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleCategory = (name: string) => {
    const normalized = normalizeCategory(name);

    setSelectedCategories((prev) => {
      const exists = prev.includes(normalized);

      // remove
      if (exists) return prev.filter((x) => x !== normalized);

      // add (max 2)
      if (prev.length >= 2) return prev;

      return [...prev, normalized];
    });
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    // ✅ Convert UI string -> array for backend
    const languagesArray = languagesTextToArray(languagesText);

    const res = await updateMyTutorProfileAction({
      bio: bio.trim() || undefined,
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      experienceYrs: experienceYrs ? Number(experienceYrs) : undefined,
      location: location.trim() || undefined,

      // ✅ send array (backend stores JSON string)
      languages: languagesArray,

      profileImage: profileImage.trim() ? profileImage.trim() : null,
      categories: selectedCategories,
    });

    setSaving(false);

    if (res.success) {
      setMsg("Profile updated ✅");

      // ✅ CRITICAL FIX:
      // never do setLanguagesText(updated.languages) directly
      // because that can be an ARRAY and will show ["English","Bangla"] in UI
      const arr = parseLanguages(res.data?.languages);
      setLanguagesText(arr.join(", ")); // ✅ "English, Bangla"
    } else {
      setMsg("Update failed ❌");
    }
  };

  const avatarSrc = profileImage?.trim() || user?.image || "";
  const displayName = user?.name ?? "Tutor";

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

          {/* ✅ Languages as comma-separated TEXT (no array in UI) */}
          <div className="space-y-2">
            <Label>Languages</Label>
            <Input
              value={languagesText} // ✅ ALWAYS string
              onChange={(e) => setLanguagesText(e.target.value)} // ✅ ALWAYS string
              placeholder="English, Bangla"
            />
            <p className="text-xs text-muted-foreground">
              Separate languages with comma. Example: English, Bangla
            </p>
          </div>

          {/* ✅ Categories SELECT (max 2) */}
          <div className="space-y-2">
            <Label>Categories (select max 2)</Label>

            {catLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : catError ? (
              <p className="text-sm text-red-500">{catError}</p>
            ) : (
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
                    const disabled =
                      !checked && selectedCategories.length >= 2;

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
                  categories. Duplicates are merged automatically
                  (case-insensitive).
                </p>
              </div>
            )}
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
