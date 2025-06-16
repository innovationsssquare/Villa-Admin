"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "@/public/Asset/Logo.png";
import Logo2 from "@/public/Asset/Logo2.png";
import {
  LayoutDashboard,
  PackageSearch,
  Heart,
  ReceiptIndianRupee,
  Mail,
  Users,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PackageCheck,
  List,
} from "lucide-react";
import User from "@/public/Asset/User.png";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";

const Sidenav = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("")
  const [userAvatar, setUserAvatar] = useState("")

 useEffect(() => {
    // Fetch from localStorage on mount
    const name = localStorage.getItem("fullName")
    const avatar = localStorage.getItem("profilePic")

    setUserName(name || "Unknown User")
    setUserAvatar(avatar || "/placeholder.svg")
  }, [])

  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  })


  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Property Owner", icon: PackageSearch, path: "/property-owner" },
    { label: "Manage Property", icon: Heart, path: "/manage-property" },
    { label: "Categories", icon: List, path: "/categories" },
    { label: "All Booking", icon: PackageCheck, path: "/booking" },
    {
      label: "Revenue & Commission",
      icon: ReceiptIndianRupee,
      path: "/revenue",
    },
  ];

  const isActive = (path) => {
    if (path === "/" && pathname === "/") {
      return true;
    }

    const basePathRegex = new RegExp(`^${path}(/|$)`);
    if (basePathRegex.test(pathname)) {
      return true;
    }

    return false;
  };

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`h-screen sticky top-0 bottom-0 left-0 overflow-hidden border-r border-gray-300 hidden md:flex lg:flex flex-col items-center bg-white transition-all duration-700 ease-in-out ${
        isMinimized
          ? "w-20  transition-all duration-700 ease-in-out"
          : "w-60  transition-all duration-700 ease-in-out"
      }`}
    >
      {/* Header with logo and toggle button */}
      <div className="p-0 sticky top-0 border-b w-full h-16 flex justify-between items-center px-4 transition-all duration-300 ease-in-out">
        {!isMinimized ? (
          <>
           
            <div
              className="w-auto transform transition-all duration-500 ease-in-out"
            ></div>
          </>
        ) : (
          <></>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-12 w-12 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          {isMinimized ? (
            <PanelLeftOpen
              size={20}
              className="text-[#106C83] cursor-pointer"
            />
          ) : (
            <PanelLeftClose
              size={20}
              className="text-[#106C83] cursor-pointer"
            />
          )}
        </Button>
      </div>

      <div className="flex w-full mt-3 px-2 flex-col flex-1">
        <div className="py-2">
          {!isMinimized && (
            <p className="px-4 text-xs font-medium text-gray-500 mb-1 transition-all duration-900 ease-in-out">
              Dashboard
            </p>
          )}
          <div
            className={cn(
              "space-y-1 pb-2",
              !isMinimized && "border-b border-gray-200"
            )}
          >
            <TooltipProvider>
              {navItems.map((item) =>
                isMinimized ? (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        onPress={() => router.push(item.path)}
                        className={`w-full flex justify-center cursor-pointer items-center p-2 text-sm rounded-md transition-all duration-900 ${
                          isActive(item.path)
                            ? "bg-[#106C83] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="p-2">
                      <p className="text-sm font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    key={item.label}
                    onPress={() => router.push(item.path)}
                    className={`w-56 flex justify-start cursor-pointer items-center px-4 py-2 text-sm rounded-md transition-all duration-300 ${
                      isActive(item.path)
                        ? "bg-[#106C83] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon size={15} className="mr-2" />
                    <span
                      className={`transition-all transform duration-900 ${
                        isMinimized ? "w-20 opacity-0" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </Button>
                )
              )}
            </TooltipProvider>
          </div>
        </div>

        <div className="py-2">
          {!isMinimized && (
            <p className="px-4 text-xs font-medium text-gray-500 mb-1">
              Account
            </p>
          )}
          <div className="space-y-0.5">
            <TooltipProvider>
              {isMinimized ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onPress={() => router.push("/settings")}
                      className={`w-full cursor-pointer flex justify-center items-center p-2 text-sm rounded-md transition-all duration-300 ${
                        isActive("/settings")
                          ? "bg-[#106C83] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Settings size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-2">
                    <p className="text-sm font-medium">Settings</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  onPress={() => router.push("/settings")}
                  className={`w-56 flex justify-start cursor-pointer items-center px-4 py-2 text-sm rounded-md transition-all duration-300 ${
                    isActive("/settings")
                      ? "bg-[#106C83] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings size={15} className="mr-2" />
                  Settings
                </Button>
              )}
            </TooltipProvider>
          </div>
        </div>

        {/* User profile section */}
        <div
          className={cn(
            "mt-auto border-t",
            isMinimized ? "p-2" : "p-4",
            "flex items-center"
          )}
        >
          {isMinimized ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden cursor-pointer mx-auto">
                  <img
                    src={userAvatar}
                    alt="User Avatar"
                    width={32}
                    height={32}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="w-auto p-0">
                <div className="p-3 w-60">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <img
                        src={userAvatar}
                        alt="User Avatar"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-white">
                        {currentDate}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex-1 w-56">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500 truncate">
                 {currentDate}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
