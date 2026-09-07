"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home, LifeBuoy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Error({ error, reset }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Dashboard error caught by app/error.js:", error);
  }, [error]);

  const errorMessage = error?.message || "An unexpected error occurred while loading this section.";

  return (
    <ScrollArea className="h-[calc(100vh-64px)] w-full bg-neutral-50/60 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          {/* Icon with glow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-amber-500/10 dark:bg-amber-500/15 blur-xl animate-pulse" />
              <div className="relative bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 rounded-3xl shadow-xl">
                <AlertCircle className="w-14 h-14 sm:w-16 sm:h-16 text-[#FF6900]" />
              </div>
            </div>
          </div>

          {/* Heading and badge */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-[#FFF1E6] dark:bg-orange-950/60 text-[#FF6900] border border-[#FF6900]/30">
              Module Error
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              Unable to Load Content
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
              We encountered an issue fetching or rendering this dashboard module. Your other tabs and navigation remain available.
            </p>
          </div>

          {/* Collapsible Error Details */}
          <div className="text-left bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Diagnostic Information
              </span>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[11px] font-semibold text-[#FF6900] hover:underline cursor-pointer"
              >
                {showDetails ? "Hide" : "Show"}
              </button>
            </div>
            {showDetails && (
              <div className="mt-3 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-red-600 dark:text-red-400 break-all leading-normal max-h-36 overflow-y-auto">
                {errorMessage}
                {error?.digest && (
                  <div className="mt-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-sans">
                    Digest: {error.digest}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6900] hover:bg-[#E05D00] text-white font-bold text-xs shadow-lg shadow-[#FF6900]/25 transition-all cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Retry Module</span>
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard Home</span>
            </Link>
            <Link
              href="/support"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <LifeBuoy className="w-4 h-4 text-[#FF6900]" />
              <span>Support Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
