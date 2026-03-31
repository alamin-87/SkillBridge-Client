import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, ArrowLeft } from "lucide-react";
import AdminProfileForm from "./profile-form";
import { getAdminMeAction } from "@/actions/admin-action";

export default async function AdminProfilePage() {
  const { success, data, message } = await getAdminMeAction();
  if (!success) return <div className="p-8 text-center text-red-500 font-bold bg-red-50 rounded-xl border border-red-100">Failed to load system profile: {message}</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminProfileForm defaultValues={data} />
    </div>
  );
}
