"use client";

import { useState, useTransition } from "react";
import {
  broadcastNotificationAction,
  sendNotificationToUserAction,
} from "@/actions/admin-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

export default function SendNotificationForm() {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<"broadcast" | "user">("broadcast");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || (type === "user" && !userId)) {
      toast.error("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      const res =
        type === "broadcast"
          ? await broadcastNotificationAction({ title, message })
          : await sendNotificationToUserAction({ userId, title, message });

      if (res.success) {
        toast.success(res.message);
        setTitle("");
        setMessage("");
        setUserId("");
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
        <CardDescription>
          Send a system notification to all active users or a specific user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <RadioGroup
            defaultValue="broadcast"
            onValueChange={(v) => setType(v as any)}
            className="flex gap-4 mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="broadcast" id="broadcast" />
              <Label htmlFor="broadcast">Broadcast (All Users)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">Specific User</Label>
            </div>
          </RadioGroup>

          {type === "user" && (
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter user ID..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Notification title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              className="resize-none"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isPending ? "Sending..." : "Send Notification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
