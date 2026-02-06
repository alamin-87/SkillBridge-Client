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
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateStudentProfileAction({
      name: name.trim() || undefined,
      phone: phone.trim() ? phone.trim() : null,
      image: image.trim() ? image.trim() : null,
    });

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
            <Label>Profile image URL</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
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
