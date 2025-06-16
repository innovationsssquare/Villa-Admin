import Image from "next/image";
import React from "react";
import { Bell, ChevronDown, ChevronRight } from "lucide-react";
import NotificationSheet from "./notification-sheet";

const Nav = () => {
  
  return (
    <header className="h-16 py-8 border-b flex items-center justify-between px-6 sticky top-0 z-50 bg-white">
     
      <div></div>
      <div className="flex items-center space-x-4">
        <NotificationSheet />

      
      </div>
    </header>
  );
};

export default Nav;
