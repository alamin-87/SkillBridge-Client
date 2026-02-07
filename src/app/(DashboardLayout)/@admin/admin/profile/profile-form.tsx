"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAdminMeAction } from "@/actions/admin-action";

export default function AdminProfileForm({
  defaultValues,
}: {
  defaultValues: any;
}) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [phone, setPhone] = useState(defaultValues?.phone ?? "");
  const [image, setImage] = useState(defaultValues?.image ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const onSave = () => {
    setMsg(null);
    start(async () => {
      const res = await updateAdminMeAction({
        name: name.trim() || undefined,
        phone: phone.trim() ? phone.trim() : null,
        image: image.trim() ? image.trim() : null,
        email: email.trim() || undefined,
      });

      setMsg(res.success ? "Profile updated ✅" : res.message || "Update failed");
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Name</p>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Email</p>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Phone</p>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <p className="text-sm text-muted-foreground mb-1">Image URL</p>
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      </div>
    </div>
  );
}
