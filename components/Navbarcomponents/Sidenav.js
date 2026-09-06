"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "@/public/Asset/applogo.png";
import Logo2 from "@/public/Asset/icon.png";
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
  WalletCards,
  Scale,
  LifeBuoy,
  Megaphone,
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
  const [userName, setUserName] = useState("Admin");
  const [userAvatar, setUserAvatar] = useState("/placeholder.svg");

  useEffect(() => {
    // Fetch from localStorage on mount
    const name = localStorage.getItem("fullName");
    const avatar = localStorage.getItem("profilePic");

    if (name) setUserName(name);
    if (avatar) setUserAvatar(avatar);
  }, []);

  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Property Owner", icon: PackageSearch, path: "/property-owner" },
    { label: "Manage Property", icon: Heart, path: "/manage-property" },
    // { label: "Add Property", icon: Heart, path: "/addproperty" },
    { label: "Categories", icon: List, path: "/categories" },
    { label: "All Booking", icon: PackageCheck, path: "/booking" },
    {
      label: "Revenue & Commission",
      icon: ReceiptIndianRupee,
      path: "/revenue",
    },
    {
      label: "Host Payouts",
      icon: WalletCards,
      path: "/payouts",
    },
    {
      label: "Disputes",
      icon: Scale,
      path: "/disputes",
    },
    {
      label: "Support & Helpdesk",
      icon: LifeBuoy,
      path: "/support",
    },
    {
      label: "Announcements",
      icon: Megaphone,
      path: "/announcements",
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
      className={`h-screen sticky top-0 bottom-0 left-0 overflow-hidden border-r border-gray-200 dark:border-neutral-800/80 hidden md:flex lg:flex flex-col items-center bg-white dark:bg-[#09090B] transition-all duration-500 ease-in-out ${isMinimized
        ? "w-20 transition-all duration-500 ease-in-out"
        : "w-60 transition-all duration-500 ease-in-out"
        }`}
    >
      {/* Header with logo and toggle button */}
      <div className="p-0 sticky top-0 border-b border-gray-200 dark:border-neutral-800/80 w-full h-16 flex justify-between items-center px-4 transition-all duration-300 ease-in-out bg-white dark:bg-[#09090B]">
        {!isMinimized ? (
          <>
            <div className="w-auto transform transition-all duration-500 ease-in-out flex items-center">
              <Image className="object-contain" src={Logo} alt="logo" height={120} width={140} />
            </div>
          </>
        ) : (
          <></>
        )}

        <Button
          variant="light"
          onClick={toggleSidebar}
          isIconOnly={true}
          className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
        >
          {isMinimized ? (
            <PanelLeftOpen
              size={20}
              className="text-[#FF6900] cursor-pointer"
            />
          ) : (
            <PanelLeftClose
              size={20}
              className="text-[#FF6900] cursor-pointer"
            />
          )}
        </Button>
      </div>

      <div className="flex w-full mt-3 px-2 flex-col flex-1">
        <div className="py-2">
          {!isMinimized && (
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1 transition-all duration-500 ease-in-out">
              Navigation
            </p>
          )}
          <div
            className={cn(
              "space-y-1 pb-2",
              !isMinimized && "border-b border-gray-200 dark:border-neutral-800/80",
            )}
          >
            <TooltipProvider>
              {navItems.map((item) =>
                isMinimized ? (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="light"
                        isIconOnly={true}
                        onPress={() => router.push(item.path)}
                        className={`w-full flex justify-center cursor-pointer items-center p-2 text-sm rounded-lg transition-all duration-300 ${isActive(item.path)
                          ? "bg-[#FF6900] text-white shadow-md shadow-[#FF6900]/25"
                          : "text-gray-700 dark:text-neutral-300 hover:bg-[#FFF1E6] dark:hover:bg-neutral-800/80 hover:text-[#FF6900] dark:hover:text-[#FF6900]"
                          }`}
                      >
                        <item.icon size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="p-2 bg-[#171717] dark:bg-neutral-900 text-white border border-neutral-800">
                      <p className="text-sm font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant="light"
                    key={item.label}
                    onPress={() => router.push(item.path)}
                    className={`w-56 flex justify-start cursor-pointer items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${isActive(item.path)
                      ? "bg-gradient-to-r from-[#FF6900] to-[#FF8733] text-white shadow-md shadow-[#FF6900]/25 font-semibold"
                      : "text-gray-700 dark:text-neutral-300 hover:bg-[#FFF1E6] dark:hover:bg-neutral-800/80 hover:text-[#FF6900] dark:hover:text-[#FF6900]"
                      }`}
                  >
                    <item.icon size={16} className="mr-2.5" />
                    <span
                      className={`transition-all transform duration-500 ${isMinimized ? "w-20 opacity-0" : ""
                        }`}
                    >
                      {item.label}
                    </span>
                  </Button>
                ),
              )}
            </TooltipProvider>
          </div>
        </div>

        {/* User profile section */}
        <div
          className={cn(
            "mt-auto border-t border-gray-200 dark:border-neutral-800/80",
            isMinimized ? "p-2" : "p-4",
            "flex items-center",
          )}
        >
          {isMinimized ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-neutral-800 overflow-hidden cursor-pointer mx-auto">
                  <Image
                    src={userAvatar}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={() => setUserAvatar("/placeholder.svg")}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="w-auto p-0">
                <div className="p-3 w-60 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-neutral-800 overflow-hidden">
                      <Image
                        src={userAvatar}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        onError={() => setUserAvatar("/placeholder.svg")}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">{currentDate}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/50"
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-neutral-800 mr-2 overflow-hidden">
                <Image
                  src={userAvatar}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  onError={() => setUserAvatar("/placeholder.svg")}
                />
              </div>
              <div className="flex-1 w-56">
                <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{currentDate}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
