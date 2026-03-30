"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, Loader2, Info } from "lucide-react";
import { 
  getMyNotificationsAction, 
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction
} from "@/actions/notification-action";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getMyNotificationsAction();
      if (res.success && Array.isArray(res.data)) {
        // Sort newest first
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sorted);
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: set up an interval to poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      await markNotificationAsReadAction(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarking(true);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await markAllNotificationsAsReadAction();
    } catch (error) {
      console.error(error);
    } finally {
      setIsMarking(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative hover:bg-muted/80 rounded-full"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && notifications.length === 0) fetchNotifications();
        }}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/20">
            <h3 className="font-bold text-sm flex items-center gap-2">
              Notifications {unreadCount > 0 && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{unreadCount} new</span>}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarking}
                className="text-xs font-semibold text-[#3b82f6] hover:text-[#2563eb] disabled:opacity-50 transition-colors"
              >
                {isMarking ? "Marking..." : "Mark all read"}
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-8 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell className="h-5 w-5 text-muted-foreground opacity-50" />
                </div>
                <p className="text-sm font-semibold">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No new notifications right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/30 ${
                      !notification.isRead ? "bg-muted/10" : ""
                    }`}
                    onClick={() => {
                      if (!notification.isRead) handleMarkAsRead(notification.id);
                    }}
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className={`size-8 rounded-full flex items-center justify-center ${
                        !notification.isRead 
                          ? "bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] text-white shadow-sm" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {notification.type === 'BOOKING' ? <Check className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm ${!notification.isRead ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                        {notification.message}
                      </p>
                      <p className="text-[10px] font-semibold text-muted-foreground/70 tracking-wider">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <div className="shrink-0 self-center">
                        <div className="size-2 rounded-full bg-[#3b82f6]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
             <div className="border-t border-border/40 bg-muted/10 p-2">
                 <Button variant="ghost" className="w-full text-xs font-semibold py-1 h-8 rounded-lg" asChild>
                    <span className="text-muted-foreground pointer-events-none">Notifications automatically delete after 30 days</span>
                 </Button>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
