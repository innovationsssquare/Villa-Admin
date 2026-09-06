import { io } from "socket.io-client";
import { SocketUrl } from "@/lib/API/Baseurl";

let socket = null;
const listeners = new Set();

/**
 * Initializes or returns the singleton Socket.IO connection for the Admin Console
 */
export const getAdminSocket = () => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(SocketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("⚡ [Admin Socket] Connected:", socket.id);
      // Join dedicated admin room
      socket.emit("join_admin_room", {
        role: "admin",
        connectedAt: new Date().toISOString(),
      });
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ [Admin Socket] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 [Admin Socket] Disconnected:", reason);
    });

    // Listen to admin events and dispatch to subscribers
    const adminEvents = [
      "admin_new_dispute",
      "admin_dispute_status_changed",
      "admin_dispute_resolved",
      "admin_dispute_note_added",
      "admin_payout_executed",
      "new_booking",
      "booking_cancelled",
      "owner_registered",
      "property_created",
    ];

    adminEvents.forEach((eventName) => {
      socket.on(eventName, (data) => {
        listeners.forEach((listener) => {
          try {
            listener({ event: eventName, data, timestamp: new Date() });
          } catch (e) {
            console.error("Listener error:", e);
          }
        });
      });
    });
  }

  return socket;
};

/**
 * Subscribe a component to all incoming live administrative events
 * @param {Function} callback - ({ event, data, timestamp }) => void
 * @returns {Function} unsubscribe cleanup function
 */
export const subscribeAdminEvents = (callback) => {
  getAdminSocket();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

/**
 * Gracefully disconnect socket on admin logout
 */
export const disconnectAdminSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
