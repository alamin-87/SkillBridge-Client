"use client";

import * as React from "react";
import { updateStudentProfileAction } from "@/actions/student-action";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { getIconComponent } from "@/lib/icon-mapper";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function initials(name?: string) {
  const n = (name ?? "User").trim();
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ProfileForm({ user }: { user: any }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(user?.name ?? "");
  const [phone, setPhone] = React.useState(user?.phone ?? "");
  const [image, setImage] = React.useState(user?.image ?? "");
  const [useUpload, setUseUpload] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const router = useRouter();

  // Resolved Icons via Mapper
  const PencilIcon = getIconComponent("Pencil");
  const SaveIcon = getIconComponent("Save");
  const XIcon = getIconComponent("X");
  const MailIcon = getIconComponent("Mail");
  const PhoneIcon = getIconComponent("Phone");
  const UserIcon = getIconComponent("User");
  const CameraIcon = getIconComponent("Camera");
  const GlobeIcon = getIconComponent("Globe");
  const Loader2Icon = getIconComponent("Loader2");
  const CalendarIcon = getIconComponent("Calendar");
  const ShieldCheckIcon = getIconComponent("ShieldCheck");
  const MapPinIcon = getIconComponent("MapPin");
  const FileCodeIcon = getIconComponent("FileCode");
  const LayoutDashboardIcon = getIconComponent("LayoutDashboard");

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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
    if (res.success) {
      toast.success("Profile updated successfully! ✨");
      setIsEditing(false);
      window.dispatchEvent(new Event("profile-updated"));
      router.refresh();
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const cancelEdit = () => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
    setImage(user?.image ?? "");
    setFile(null);
    setUseUpload(false);
    setIsEditing(false);
  };

  const previewImage = useUpload && file ? URL.createObjectURL(file) : image;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Profile Header Card */}
      <Card className="overflow-hidden border-none shadow-2xl bg-card/60 backdrop-blur-md">
        {/* Banner Section */}
        <div className="h-40 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -bottom-16 left-8 p-1.5 rounded-full bg-background border-4 border-background shadow-xl">
            <Avatar className="h-32 w-32 border-2 border-primary/10">
              <AvatarImage src={previewImage || undefined} alt={name} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-linear-to-br from-indigo-50 to-purple-50 text-indigo-600 dark:from-indigo-950 dark:to-purple-950 dark:text-indigo-400">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 hover:scale-110 transition-all shadow-lg active:scale-95"
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
                  {user?.name}
                </h1>
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 px-3 py-0.5 rounded-full font-semibold">
                  {user?.role === "STUDENT" ? "Student" : user?.role || "Student"}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 font-medium">
                <MailIcon className="w-4 h-4 text-primary/60" />
                {user?.email}
              </p>
            </div>

            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline" 
                className="group border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-full h-11 px-6 shadow-sm"
              >
                <PencilIcon className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar stats */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                Account Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground">Status</p>
                <div className="flex items-center gap-2 bg-emerald-500/5 dark:bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/10">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <span className="font-bold text-emerald-600 dark:text-emerald-400 capitalize">{user?.status || "Active"}</span>
                </div>
              </div>

              <Separator className="bg-primary/5" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm group">
                  <span className="text-muted-foreground flex items-center gap-2 group-hover:text-foreground transition-colors font-medium">
                     <CalendarIcon className="w-4 h-4 text-indigo-500" />
                     Member Since
                  </span>
                  <span className="font-bold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" }) : "Mar 20, 2024"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm group">
                  <span className="text-muted-foreground flex items-center gap-2 group-hover:text-foreground transition-colors font-medium">
                     <GlobeIcon className="w-4 h-4 text-pink-500" />
                     Timezone
                  </span>
                  <span className="font-bold">UTC +06:00</span>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="ghost" className="w-full justify-start text-xs text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 rounded-lg h-9">
                   <LayoutDashboardIcon className="w-3.5 h-3.5 mr-2" />
                   View Learning Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Details */}
        <Card className="md:col-span-2 shadow-lg border-primary/5 bg-card/40 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-500" />
              Primary Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={onSave} className="space-y-6 py-2 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                      <UserIcon className="w-3 h-3" />
                      Full Name
                    </Label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="h-12 bg-muted/20 border-primary/10 focus-visible:ring-indigo-500/30 rounded-xl"
                      placeholder="Enter your full name" 
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                      <PhoneIcon className="w-3 h-3" />
                      Contact Number
                    </Label>
                    <Input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="h-12 bg-muted/20 border-primary/10 focus-visible:ring-indigo-500/30 rounded-xl"
                      placeholder="e.g. +880 1XXX XXX XXX" 
                    />
                  </div>
                </div>

                <div className="space-y-4 p-5 rounded-2xl bg-muted/30 border border-primary/5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                      <CameraIcon className="w-3 h-3" />
                      Profile Picture
                    </Label>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs font-bold text-indigo-600"
                      onClick={() => { setUseUpload(!useUpload); setFile(null); setImage(""); }}
                    >
                      {useUpload ? "Use URL" : "Upload File"}
                    </Button>
                  </div>
                  {useUpload ? (
                    <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-primary/10 hover:border-indigo-500/40 transition-all bg-card/30">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="opacity-0 absolute inset-0 cursor-pointer z-10 h-28"
                      />
                      <div className="flex flex-col items-center justify-center h-28 pointer-events-none gap-2">
                         <div className="p-3 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                           <CameraIcon className="w-6 h-6 text-indigo-600" />
                         </div>
                         <p className="text-xs font-bold text-muted-foreground">
                            {file ? file.name : "Click to upload your photo"}
                         </p>
                      </div>
                    </div>
                  ) : (
                    <Input 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)} 
                      placeholder="Paste image URL here..." 
                      className="h-11 bg-muted/20 border-primary/10 focus-visible:ring-indigo-500/30 rounded-xl"
                    />
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-primary/5">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={cancelEdit}
                    disabled={saving}
                    className="h-11 px-6 rounded-full font-bold hover:bg-destructive/5 hover:text-destructive transition-colors"
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="h-11 px-8 rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    {saving ? (
                      <>
                        <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-10 py-4 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Full Name</p>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 rounded-xl bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors">
                        <UserIcon className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="text-lg font-bold truncate leading-none">{user?.name || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Contact Phone</p>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 rounded-xl bg-pink-500/5 group-hover:bg-pink-500/10 transition-colors">
                        <PhoneIcon className="w-5 h-5 text-pink-500" />
                      </div>
                      <p className="text-lg font-bold truncate leading-none">{user?.phone || "Not set"}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Email Address</p>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 rounded-xl bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors">
                        <MailIcon className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="text-lg font-bold truncate leading-none">{user?.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Default Location</p>
                    <div className="flex items-center gap-4 group">
                      <div className="p-2.5 rounded-xl bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors">
                        <MapPinIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-lg font-bold truncate leading-none">Bangladesh</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-10">
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileCodeIcon className="w-3 h-3" />
                    Technical ID
                  </p>
                  <div className="relative group">
                    <code className="text-[11px] bg-muted/30 p-4 rounded-xl block border border-primary/5 select-all overflow-x-auto font-mono text-muted-foreground group-hover:text-foreground group-hover:bg-muted/50 transition-all">
                      {user?.id}
                    </code>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Badge variant="outline" className="text-[9px] bg-background">System ID</Badge>
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

