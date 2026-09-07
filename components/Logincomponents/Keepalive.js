"use client";
import { useEffect } from "react";
import { BaseUrl } from "@/lib/API/Baseurl";

const KeepAlive = () => {
  useEffect(() => {
    // Don't ping external servers during local development
    if (
      typeof window === "undefined" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return;
    }

    const keepaliveUrl =
      process.env.NEXT_PUBLIC_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_BASE_URL;

    if (!keepaliveUrl || keepaliveUrl.includes("localhost")) {
      return;
    }

    const ping = async () => {
      try {
        const pingTarget = `${keepaliveUrl.replace(/\/api\/v1\/?$/, "")}/keepalive`;
        const response = await fetch(pingTarget, {
          method: "GET",
          cache: "no-store",
        });
        if (response.ok) {
          console.debug("Keepalive ping successful");
        }
      } catch (error) {
        // Non-intrusive catch to avoid triggering Next.js dev error overlays
        console.debug("Keepalive ping skipped:", error?.message);
      }
    };

    const interval = setInterval(ping, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default KeepAlive;