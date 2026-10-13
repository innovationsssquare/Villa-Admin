"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Info,
  MessageSquare,
  Package,
  ShieldAlert,
  Wallet,
  X,
  Building2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { subscribeAdminEvents } from "@/lib/Socket/socketClient";
import {
  fetchAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/API/Notification/Notification";
import { useToast } from "@/components/ui/toast-provider";

// Helper for relative timestamps
function formatRelativeTime(dateInput) {
  if (!dateInput) return "Just now";
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Just now";
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 45) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "Just now";
  }
}

function playNotificationChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

export default function NotificationSheet() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // 1. Fetch persisted admin notifications from backend
  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetchAdminNotifications(1, 50);
      if (res?.success && Array.isArray(res?.data)) {
        const formatted = res.data.map((doc) => {
          const isProp =
            doc.type === "new_property_added" ||
            doc.type === "property_created" ||
            doc.category === "property";

          return {
            id: doc._id || doc.id,
            type: isProp ? "property" : doc.category || "info",
            title: doc.title,
            description: doc.message,
            time: formatRelativeTime(doc.createdAt),
            createdAt: doc.createdAt,
            read: Boolean(doc.isRead),
            actionUrl: doc.actionButton?.url || (isProp ? "/manage-property" : null),
            data: doc.data,
          };
        });
        setNotifs(formatted);
      }
    } catch (err) {
      console.warn("Failed to load admin notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Polling fallback every 20 seconds so notifications never get missed
    const interval = setInterval(() => {
      loadNotifications();
    }, 20000);

    // Refresh immediately on window/tab focus
    const onFocus = () => {
      loadNotifications();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadNotifications]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  // 2. Real-time WebSocket subscription
  useEffect(() => {
    const unsubscribe = subscribeAdminEvents(({ event, data }) => {
      let newNotif = null;
      const timeStr = "Just now";

      switch (event) {
        // 🏡 Property added by Owner
        case "property_created":
        case "broadcast_property_created":
        case "admin_notification_new":
        case "broadcast_admin_notification_new": {
          const isPropertyEvent =
            event.includes("property_created") ||
            data?.category === "property" ||
            data?.type === "new_property_added";

          if (isPropertyEvent) {
            const pType = data?.propertyType || "Property";
            const pName = data?.propertyName || data?.title || "New Listing";
            const ownerInfo = data?.ownerName ? `by ${data.ownerName}` : "by Owner";
            const loc = data?.location ? ` in ${data.location}` : "";

            newNotif = {
              id: data?.id || data?.notificationId || `prop-${Date.now()}`,
              type: "property",
              title: data?.title || `🏡 New ${pType} Added: ${pName}`,
              description:
                data?.description ||
                data?.message ||
                `Owner ${ownerInfo}${loc} submitted a new ${pType} for approval.`,
              time: timeStr,
              createdAt: new Date().toISOString(),
              read: false,
              actionUrl: data?.actionUrl || "/manage-property",
              data: data?.data || data,
            };

            // Interactive screen toast & sound for admin
            try {
              playNotificationChime();
              toast({
                title: `🏡 New ${pType} Added!`,
                description: `${pName} submitted ${ownerInfo}${loc}. Click to review.`,
                variant: "success",
              });
            } catch {}
          }
          break;
        }

        case "admin_new_dispute":
          newNotif = {
            id: `dsp-${Date.now()}`,
            type: "alert",
            title: `⚠️ Dispute: ${data.disputeId || "New Case"}`,
            description: `${data.title || "Complaint filed"} by ${data.raisedByName || "User"}. Amount: ₹${Number(data.disputedAmount || 0).toLocaleString()} [${data.priority || "NORMAL"}]`,
            time: timeStr,
            createdAt: new Date().toISOString(),
            read: false,
            actionUrl: "/disputes",
          };
          break;

        case "admin_dispute_resolved":
          newNotif = {
            id: `res-${Date.now()}`,
            type: "success",
            title: `✅ Dispute Resolved: ${data.disputeId}`,
            description: `Action: ${data.action}. ${data.summary || ""}`,
            time: timeStr,
            createdAt: new Date().toISOString(),
            read: false,
            actionUrl: "/disputes",
          };
          break;

        case "admin_payout_executed":
          newNotif = {
            id: `pay-${Date.now()}`,
            type: "wallet",
            title: `💸 Payout Sent: ₹${Number(data.amount || 0).toLocaleString()}`,
            description: `Disbursed to ${data.ownerName || "Host"} via ${data.mode || "IMPS"}. Ref: ${data.utr || data.payoutId}`,
            time: timeStr,
            createdAt: new Date().toISOString(),
            read: false,
            actionUrl: "/payouts",
          };
          break;

        case "new_booking":
          newNotif = {
            id: `bk-${Date.now()}`,
            type: "package",
            title: `🎉 New Booking Received`,
            description: `${data.propertyName || "Property"} booked for ₹${Number(data.totalAmount || 0).toLocaleString()}`,
            time: timeStr,
            createdAt: new Date().toISOString(),
            read: false,
            actionUrl: "/booking",
          };
          break;

        default:
          break;
      }

      if (newNotif) {
        setNotifs((prev) => {
          // Avoid duplicate by id
          const filtered = prev.filter((p) => p.id !== newNotif.id);
          return [newNotif, ...filtered.slice(0, 49)];
        });
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [toast]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await markNotificationRead(id);
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
    } catch {}
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      setOpen(false);
      router.push(notification.actionUrl);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "property":
        return <Building2 className="h-4 w-4 text-[#FF6900]" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "alert":
        return <ShieldAlert className="h-4 w-4 text-rose-500" />;
      case "wallet":
        return <Wallet className="h-4 w-4 text-[#FF6900]" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <Check className="h-4 w-4 text-emerald-500" />;
      case "package":
        return <Package className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val) loadNotifications();
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative cursor-pointer border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-[#FF6900]/40"
        >
          <Bell className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6900] text-xs text-white shadow-sm shadow-[#FF6900]/30 font-semibold animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-white dark:bg-[#0E0E11] border-l border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
        <SheetHeader className="border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>Notifications</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF1E6] dark:bg-orange-950/60 text-[#FF6900] font-medium border border-[#FF6900]/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF6900]" />
                Live
              </span>
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-[#FF6900] hover:text-[#E05D00] hover:bg-[#FFF1E6] dark:hover:bg-neutral-800 text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(90vh-80px)] p-2">
          <div className="flex flex-col gap-3 pr-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
                <Bell className="h-8 w-8 animate-bounce text-[#FF6900]/50 mb-2" />
                <p className="text-xs">Loading notifications...</p>
              </div>
            ) : notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  No notifications
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {`You're all caught up! No alerts right now.`}
                </p>
              </div>
            ) : (
              notifs.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "flex gap-3 p-3.5 rounded-xl border transition-all cursor-pointer group",
                    notification.read
                      ? "bg-neutral-50/50 dark:bg-neutral-900/40 border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                      : "bg-[#FFF1E6]/40 dark:bg-neutral-900/90 border-[#FF6900]/25 dark:border-[#FF6900]/40 text-neutral-900 dark:text-neutral-100 shadow-sm hover:border-[#FF6900]/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-105",
                      notification.read
                        ? "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                        : "bg-white dark:bg-neutral-800 border border-[#FF6900]/30 text-[#FF6900]"
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold leading-tight",
                          !notification.read
                            ? "text-neutral-900 dark:text-neutral-100"
                            : "text-neutral-700 dark:text-neutral-300"
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full hover:bg-[#FF6900]/10 text-neutral-400 hover:text-[#FF6900] shrink-0"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[10px] text-neutral-400 font-medium">
                        {notification.time}
                      </p>
                      {notification.actionUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF6900] group-hover:underline">
                          Review
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
