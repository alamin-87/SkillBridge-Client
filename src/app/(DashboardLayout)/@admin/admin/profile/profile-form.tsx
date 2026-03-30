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
  const [useUpload, setUseUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onSave = () => {
    setMsg(null);
    start(async () => {
      const formData = new FormData();
      const payload = {
        name: name.trim() || undefined,
        phone: phone.trim() ? phone.trim() : null,
        image: useUpload ? undefined : (image.trim() ? image.trim() : null),
        email: email.trim() || undefined,
      };

      formData.append("data", JSON.stringify(payload));
      if (useUpload && file) {
        formData.append("profilePhoto", file);
      }

      const res = await updateAdminMeAction(useUpload && file ? formData : payload);

      setMsg(
        res.success ? "Profile updated ✅" : res.message || "Update failed",
      );
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground mb-1">Image URL</p>
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
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          )}
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
