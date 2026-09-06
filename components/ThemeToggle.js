"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "", compact = false }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 flex items-center justify-center opacity-60 ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
      className={`relative group flex items-center justify-center p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
        isDark
          ? "bg-neutral-900/90 hover:bg-neutral-800 border-neutral-800 text-amber-400 hover:text-amber-300 hover:border-amber-400/40 shadow-sm"
          : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:text-[#FF6900] hover:border-[#FF6900]/40 shadow-sm"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        ) : (
          <Sun className="w-4 h-4 text-[#FF6900] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
        )}
      </div>

      {!compact && (
        <span className="hidden lg:inline-block ml-2 text-xs font-semibold tracking-wide capitalize select-none text-neutral-700 dark:text-neutral-300">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
