"use client";

import Link from "next/link";
import { FileQuestion, Home, LifeBuoy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotFound() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)] w-full bg-neutral-50/60 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="text-center max-w-md mx-auto space-y-6">
          {/* Glow & Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-[#FF6900]/20 blur-xl animate-pulse" />
              <div className="relative bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-6 rounded-3xl shadow-xl">
                <FileQuestion className="w-16 h-16 sm:w-20 sm:h-20 text-[#FF6900]" />
              </div>
            </div>
          </div>

          {/* Headings */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-[#FFF1E6] dark:bg-orange-950/60 text-[#FF6900] border border-[#FF6900]/30">
              Error 404
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
              The requested console resource, dashboard metric, or management page could not be located or may have been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6900] hover:bg-[#E05D00] text-white font-bold text-xs shadow-lg shadow-[#FF6900]/25 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return to Dashboard</span>
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
