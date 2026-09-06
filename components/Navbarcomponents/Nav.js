import React from "react";
import NotificationSheet from "./notification-sheet";
import ThemeToggle from "@/components/ThemeToggle";

const Nav = () => {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 sticky top-0 z-40 bg-white dark:bg-[#09090B] border-gray-200 dark:border-neutral-800/80 transition-colors duration-300">
      <div></div>
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <NotificationSheet />
      </div>
    </header>
  );
};

export default Nav;
