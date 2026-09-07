"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { AlertTriangle, RefreshCcw, Home, Sun, Moon, LifeBuoy } from "lucide-react";

export default function GlobalError({ error, reset }) {
  const [theme, setTheme] = useState("dark");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Global error caught:", error);
    try {
      const savedTheme = localStorage.getItem("theme");
      let activeTheme = "dark";
      if (savedTheme === "light" || savedTheme === "dark") {
        activeTheme = savedTheme;
      } else if (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
      ) {
        activeTheme = "light";
      }

      setTheme(activeTheme);
      if (typeof document !== "undefined") {
        if (activeTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch {
      setTheme("dark");
    }
  }, [error]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
      if (typeof document !== "undefined") {
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch {
      // ignore
    }
  };

  const errorMessage = error?.message || "An unexpected system error occurred";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body className="min-h-screen bg-neutral-50 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors antialiased flex flex-col items-center justify-center p-4 selection:bg-[#FF6900]/20 selection:text-[#FF6900]">
        {/* Floating Theme Toggle in Top-Right Corner */}
        <div className="fixed top-4 right-4 z-50">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-sm transition-all cursor-pointer text-xs font-semibold"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <>
                <Moon className="w-4 h-4 text-amber-400" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-[#FF6900]" />
                <span>Light</span>
              </>
            )}
          </button>
        </div>

        {/* Center Error Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 rounded-3xl bg-rose-500/10 dark:bg-rose-500/15 blur-2xl animate-pulse pointer-events-none" />

            <div className="relative bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
              {/* Icon Container */}
              <div className="flex justify-center">
                <div className="relative p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 shadow-inner">
                  <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 text-rose-500 dark:text-rose-400" />
                </div>
              </div>

              {/* Title & Badge */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black tracking-widest uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                  Critical Error
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                  System Exception
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
                  A critical error occurred while rendering this view. Our engineering team has been automatically alerted.
                </p>
              </div>

              {/* Collapsible Error Details */}
              <div className="text-left">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors underline cursor-pointer"
                >
                  {showDetails ? "Hide technical details" : "Show technical details"}
                </button>
                {showDetails && (
                  <div className="mt-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-rose-600 dark:text-rose-400 break-all leading-normal max-h-36 overflow-y-auto">
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
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181B] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard Home</span>
                </button>
              </div>

              {/* Footer Assistance */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
                <a
                  href="/support"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6900] hover:underline"
                >
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>Need help? Open Support Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
