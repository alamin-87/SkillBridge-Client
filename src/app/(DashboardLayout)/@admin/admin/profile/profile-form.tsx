"use client";

import * as React from "react";
import { updateAdminMeAction } from "@/actions/admin-action";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/icon-mapper";
import { toast } from "sonner";

function initials(name?: string) {
  const n = (name ?? "Admin").trim();
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function AdminProfileForm({
  defaultValues,
}: {
  defaultValues: any;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const router = useRouter();

  const [name, setName] = React.useState(defaultValues?.name ?? "");
  const [email, setEmail] = React.useState(defaultValues?.email ?? "");
  const [phone, setPhone] = React.useState(defaultValues?.phone ?? "");
  const [image, setImage] = React.useState(defaultValues?.image ?? "");
  const [useUpload, setUseUpload] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);

  // Resolved Icons via Mapper
  const CameraIcon = getIconComponent("Camera");
  const MailIcon = getIconComponent("Mail");
  const PencilIcon = getIconComponent("Pencil");
  const ShieldCheckIcon = getIconComponent("ShieldCheck");
  const UserIcon = getIconComponent("User");
  const CalendarIcon = getIconComponent("Calendar");
  const LayoutDashboardIcon = getIconComponent("LayoutDashboard");
  const PhoneIcon = getIconComponent("Phone");
  const XIcon = getIconComponent("X");
  const Loader2Icon = getIconComponent("Loader2");
  const SaveIcon = getIconComponent("Save");

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    const payloadData = {
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() ? phone.trim() : null,
      image: useUpload ? undefined : image.trim() || null,
    };

    formData.append("data", JSON.stringify(payloadData));
    if (useUpload && file) formData.append("profilePhoto", file);

    const res = await updateAdminMeAction(
      useUpload && file ? formData : payloadData,
    );

    setSaving(false);
    if (res.success) {
      toast.success("Profile updated successfully! 🚀");
      setIsEditing(false);
      window.dispatchEvent(new Event("profile-updated"));
      router.refresh();
    } else {
      toast.error(res.message || "Failed to update profile");
    }
  };

  const cancelEdit = () => {
    setName(defaultValues?.name ?? "");
    setEmail(defaultValues?.email ?? "");
    setPhone(defaultValues?.phone ?? "");
    setImage(defaultValues?.image ?? "");
    setFile(null);
    setUseUpload(false);
    setIsEditing(false);
  };

  const previewImage =
    useUpload && file
      ? URL.createObjectURL(file)
      : image || defaultValues?.image;

  const displayName = name || "Administrator";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
      <Card className="overflow-hidden border-none shadow-2xl bg-card/60 backdrop-blur-md">
        <div className="h-40 bg-linear-to-r from-red-600 via-orange-600 to-amber-600 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -bottom-16 left-8 p-1.5 rounded-full bg-background border-4 border-background shadow-xl">
            <Avatar className="h-32 w-32 border-2 border-primary/10">
              <AvatarImage
                src={previewImage || undefined}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-bold bg-linear-to-br from-red-50 to-orange-50 text-orange-600 dark:from-red-950 dark:to-orange-950 dark:text-orange-400">
                {initials(displayName)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 p-2 bg-orange-600 text-white rounded-full cursor-pointer hover:bg-orange-700 hover:scale-110 transition-all shadow-lg active:scale-95"
              >
                <CameraIcon className="w-5 h-5" />
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
                  className="bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400 px-3 py-0.5 rounded-full font-semibold"
                >
                  Administrator
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 font-medium break-all text-sm lg:text-base">
                <MailIcon className="w-4 h-4 text-primary/60 shrink-0" />
                {email}
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="group border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-full h-11 px-6 shadow-sm"
              >
                <PencilIcon className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Update Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                Auth Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground">
                  Admin Status
                </p>
                <div className="flex items-center gap-2 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-emerald-600 uppercase">
                    Active Master
                  </span>
                </div>
              </div>
              <Separator className="bg-primary/5" />
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <UserIcon className="w-4 h-4 text-violet-500" />
                    Role
                  </span>
                  <span className="font-bold">ADMIN</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <CalendarIcon className="w-4 h-4 text-orange-500" />
                    Joined
                  </span>
                  <span className="font-bold">
                    {new Date(defaultValues?.createdAt).toLocaleDateString(
                      undefined,
                      { month: "short", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start text-xs text-muted-foreground hover:text-orange-600 hover:bg-orange-50/50 rounded-lg h-9"
                >
                  <a href="/admin">
                    <LayoutDashboardIcon className="w-3.5 h-3.5 mr-2" />
                    Control Panel
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-8 lg:col-span-9 shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-primary/5 bg-muted/5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-orange-500" />
              Administrator Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 lg:p-12">
            {isEditing ? (
              <form
                onSubmit={onSave}
                className="space-y-6 animate-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <UserIcon className="w-3 h-3" /> Full Name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 bg-muted/20 border-primary/10 focus-visible:ring-orange-500/30 rounded-xl"
                      placeholder="Your registered name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <MailIcon className="w-3 h-3" /> Email Address
                    </Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 bg-muted/20 border-primary/10 rounded-xl"
                      placeholder="Official email for platform comms"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <PhoneIcon className="w-3 h-3" /> Contact Phone
                    </Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 bg-muted/20 border-primary/10 rounded-xl"
                      placeholder="+880 1XXX XXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                        <CameraIcon className="w-3 h-3" /> Profile Image URL
                      </Label>
                      <button
                        type="button"
                        className="text-[9px] text-orange-600 hover:underline font-bold uppercase transition-all"
                        onClick={() => {
                          setUseUpload(!useUpload);
                          setFile(null);
                          setImage("");
                        }}
                      >
                        {useUpload ? "Direct Link?" : "Upload File?"}
                      </button>
                    </div>
                    {useUpload ? (
                      <div className="h-11 flex items-center px-4 rounded-xl border border-dashed border-primary/20 bg-muted/5">
                        <Input
                          type="file"
                          accept="image/*"
                          className="border-none bg-transparent cursor-pointer h-auto py-0"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    ) : (
                      <Input
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="h-11 bg-muted/20 border-primary/10 rounded-xl"
                        placeholder="https://cloudinary.com/..."
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-primary/5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="h-10 px-6 rounded-full text-xs font-bold"
                  >
                    <XIcon className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-8 rounded-full text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                  >
                    {saving ? (
                      <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <SaveIcon className="w-4 h-4 mr-2" />
                    )}
                    Commit Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-10 lg:space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8 lg:gap-y-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                      Display Name
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-500/5">
                        <UserIcon className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="font-bold text-lg text-foreground">
                        {name || "Not Specified"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                      Contact Node
                    </p>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 rounded-xl bg-blue-500/5 shrink-0">
                        <MailIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="font-bold text-sm text-foreground break-all leading-tight">
                        {email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                      Official Phone
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/5">
                        <PhoneIcon className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="font-bold text-sm text-foreground">
                        {phone || "No secondary contact set"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                      System ID
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-violet-500/5 shrink-0">
                        <ShieldCheckIcon className="w-5 h-5 text-violet-500" />
                      </div>
                      <code className="text-[10px] font-mono text-muted-foreground/70 break-all leading-tight">
                        {defaultValues?.id}
                      </code>
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/5" />

                <div className="p-6 lg:p-8 rounded-2xl bg-muted/5 border border-primary/5">
                  <div className="flex items-start gap-5">
                    <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-500/20 shrink-0">
                      <ShieldCheckIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-sm uppercase tracking-tight">
                        System Authority Level
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                        You are currently logged in with full administrative
                        privileges. Your actions are audited for security and
                        compliance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
