"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  Info,
  MessageSquare,
  Package,
  ShieldAlert,
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

// Sample notifications data
const notifications = [
  {
    id: "1",
    type: "message",
    title: "New message received",
    description:
      "You have a new message from Sarah about the project deadline.",
    time: "Just now",
    read: false,
  },
  {
    id: "2",
    type: "alert",
    title: "Security alert",
    description: "Unusual login attempt detected from a new device.",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "System update",
    description: "The system will undergo maintenance in 2 hours.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Task completed",
    description: "Your file upload has been successfully processed.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "package",
    title: "Package delivered",
    description: "Your order #38492 has been delivered to your address.",
    time: "Yesterday",
    read: true,
  },
];

export default function NotificationSheet() {
  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "alert":
        return <ShieldAlert className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      case "success":
        return <Check className="h-4 w-4" />;
      case "package":
        return <Package className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative cursor-pointer">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#106C83] text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md ">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-[#106C83] hover:text-[#106C83]/80 hover:bg-[#106C83]/10"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(90vh-80px)] p-2">
          <div className="flex flex-col gap-3 pr-4">
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                 {` You're all caught up! No new notifications.`}
                </p>
              </div>
            ) : (
              notifs.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-3 rounded-lg transition-colors",
                    notification.read
                      ? "bg-background"
                      : "bg-[#106C83]/10 hover:bg-[#106C83]/15"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      notification.read
                        ? "bg-muted"
                        : "bg-[#106C83]/20 text-[#106C83]"
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          !notification.read && "text-[#106C83]"
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
