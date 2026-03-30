"use client";

import * as React from "react";
import { updateStudentProfileAction } from "@/actions/student-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

function initials(name?: string) {
  const n = (name ?? "User").trim();
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ProfileForm({ user }: { user: any }) {
  const [name, setName] = React.useState(user?.name ?? "");
  const [phone, setPhone] = React.useState(user?.phone ?? "");
  const [image, setImage] = React.useState(user?.image ?? "");
  const [useUpload, setUseUpload] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const formData = new FormData();
    const payload = {
      name: name.trim() || undefined,
      phone: phone.trim() ? phone.trim() : null,
      image: useUpload ? undefined : (image.trim() ? image.trim() : null),
    };
    
    formData.append("data", JSON.stringify(payload));
    if (useUpload && file) {
      formData.append("profilePhoto", file);
    }

    const res = await updateStudentProfileAction(useUpload && file ? formData : payload);

    setSaving(false);
    setMsg(res.success ? "Profile updated ✅" : "Update failed ❌");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>My profile</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your basic information.
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border">
            <AvatarImage src={image || undefined} alt={name} />
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-semibold">{user?.email ?? ""}</p>
            <p className="truncate font-semibold">{user?.id ?? ""}</p>
            <p className="text-xs text-muted-foreground">
              Role: {user?.role ?? "STUDENT"}
            </p>
          </div>
        </div>

        <form onSubmit={onSave} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Profile image</Label>
              <button
                type="button"
                className="text-xs text-blue-500 hover:underline"
                onClick={() => { setUseUpload(!useUpload); setFile(null); setImage(""); }}
              >
                {useUpload ? "Use URL instead" : "Upload File instead"}
              </button>
            </div>
            {useUpload ? (
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            ) : (
              <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            {msg ? <span className="text-sm text-muted-foreground">{msg}</span> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
