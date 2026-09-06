"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Info,
  MessageSquare,
  Package,
  ShieldAlert,
  Wallet,
  X,
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

// Initial seed notifications
const initialNotifications = [
  {
    id: "seed-1",
    type: "info",
    title: "Admin System Live",
    description: "Real-time socket channel established for administrative alerts.",
    time: "Just now",
    read: false,
  },
];

export default function NotificationSheet() {
  const [notifs, setNotifs] = useState(initialNotifications);
  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    // Subscribe to live socket events from backend
    const unsubscribe = subscribeAdminEvents(({ event, data, timestamp }) => {
      let newNotif = null;
      const timeStr = "Just now";

      switch (event) {
        case "admin_new_dispute":
          newNotif = {
            id: `dsp-${Date.now()}`,
            type: "alert",
            title: `⚠️ Dispute: ${data.disputeId || "New Case"}`,
            description: `${data.title || "Complaint filed"} by ${data.raisedByName || "User"}. Amount: ₹${Number(data.disputedAmount || 0).toLocaleString()} [${data.priority || "NORMAL"}]`,
            time: timeStr,
            read: false,
          };
          break;

        case "admin_dispute_resolved":
          newNotif = {
            id: `res-${Date.now()}`,
            type: "success",
            title: `✅ Dispute Resolved: ${data.disputeId}`,
            description: `Action: ${data.action}. ${data.summary || ""}`,
            time: timeStr,
            read: false,
          };
          break;

        case "admin_payout_executed":
          newNotif = {
            id: `pay-${Date.now()}`,
            type: "wallet",
            title: `💸 Payout Sent: ₹${Number(data.amount || 0).toLocaleString()}`,
            description: `Disbursed to ${data.ownerName || "Host"} via ${data.mode || "IMPS"}. Ref: ${data.utr || data.payoutId}`,
            time: timeStr,
            read: false,
          };
          break;

        case "new_booking":
          newNotif = {
            id: `bk-${Date.now()}`,
            type: "package",
            title: `🎉 New Booking Received`,
            description: `${data.propertyName || "Property"} booked for ₹${Number(data.totalAmount || 0).toLocaleString()}`,
            time: timeStr,
            read: false,
          };
          break;

        default:
          break;
      }

      if (newNotif) {
        setNotifs((prev) => [newNotif, ...prev.slice(0, 49)]);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const markAsRead = (id) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
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
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative cursor-pointer border-neutral-200 hover:border-[#FF6900]/40">
          <Bell className="h-5 w-5 text-neutral-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6900] text-xs text-white shadow-sm shadow-[#FF6900]/30 font-semibold animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-white border-l border-neutral-200">
        <SheetHeader className="border-b border-neutral-100 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <span>Notifications</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF1E6] text-[#FF6900] font-medium">Live</span>
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-[#FF6900] hover:text-[#E05D00] hover:bg-[#FFF1E6]"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(90vh-80px)] p-2">
          <div className="flex flex-col gap-3 pr-2">
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {`You're all caught up! No new notifications.`}
                </p>
              </div>
            ) : (
              notifs.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-3 rounded-xl border transition-all",
                    notification.read
                      ? "bg-neutral-50/50 border-neutral-100 text-neutral-600"
                      : "bg-[#FFF1E6]/40 border-[#FF6900]/20 text-neutral-900 shadow-sm"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm",
                      notification.read
                        ? "bg-white border border-neutral-200"
                        : "bg-white border border-[#FF6900]/30 text-[#FF6900]"
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          !notification.read ? "text-neutral-900" : "text-neutral-700"
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full hover:bg-[#FF6900]/10 text-neutral-400 hover:text-[#FF6900]"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {notification.description}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {notification.time}
                    </p>
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
