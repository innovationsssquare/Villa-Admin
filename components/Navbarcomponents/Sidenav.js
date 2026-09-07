"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "@/public/Asset/applogo.png";
import LogoDark from "@/public/Asset/applogodark.png";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/Signin");
    }
  };

  return (
    <aside
      className={`h-screen sticky top-0 bottom-0 left-0 overflow-hidden border-r border-gray-200 dark:border-neutral-800/80 hidden md:flex lg:flex flex-col bg-white dark:bg-[#09090B] transition-all duration-300 ease-in-out z-30 ${isMinimized ? "w-20" : "w-60"
        }`}
    >
      {/* Header with logo and toggle button */}
      <div className="shrink-0 border-b border-gray-200 dark:border-neutral-800/80 w-full h-16 flex justify-between items-center px-3.5 bg-white dark:bg-[#09090B] transition-colors">
        {!isMinimized ? (
          <div className="w-auto flex items-center transition-all duration-300">
            <Image
              className="object-contain block dark:hidden  "
              src={Logo}
              alt="Villa Logo"
              height={10}
              width={140}
              priority
            />
            <Image
              className="object-contain hidden dark:block h-10 w-auto max-w-[160px]"
              src={LogoDark}
              alt="Villa Logo"
              height={40}
              width={160}
              priority
            />
          </div>
        ) : (
          <div className="w-auto flex items-center hidden justify-center">

          </div>
        )}

        <Button
          variant="light"
          onClick={toggleSidebar}
          isIconOnly={true}
          className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer text-[#FF6900]"
          title={isMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isMinimized ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </Button>
      </div>

      {/* Scrollable & Compact Navigation Section */}
      <ScrollArea className="flex-1 w-full min-h-0">
        <div className="py-2.5 px-2">
          {!isMinimized && (
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 select-none transition-all">
              Navigation
            </p>
          )}
          <div className="space-y-0.5">
            <TooltipProvider delayDuration={150}>
              {navItems.map((item) =>
                isMinimized ? (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="light"
                        isIconOnly={true}
                        onPress={() => router.push(item.path)}
                        className={`w-10 h-10 flex justify-center cursor-pointer items-center my-0.5 mx-auto rounded-xl transition-all duration-200 ${isActive(item.path)
                          ? "bg-[#FF6900] text-white shadow-md shadow-[#FF6900]/25"
                          : "text-gray-600 dark:text-neutral-400 hover:bg-[#FFF1E6] dark:hover:bg-neutral-800/80 hover:text-[#FF6900] dark:hover:text-[#FF6900]"
                          }`}
                      >
                        <item.icon size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="p-2 bg-[#171717] dark:bg-neutral-900 text-white border border-neutral-800 shadow-lg text-xs font-semibold"
                    >
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant="light"
                    key={item.label}
                    onPress={() => router.push(item.path)}
                    className={`w-full flex justify-start cursor-pointer items-center px-3 py-2 text-[13px] rounded-lg transition-all duration-200 ${isActive(item.path)
                      ? "bg-gradient-to-r from-[#FF6900] to-[#FF8733] text-white shadow-sm shadow-[#FF6900]/25 font-semibold"
                      : "text-gray-700 dark:text-neutral-300 hover:bg-[#FFF1E6] dark:hover:bg-neutral-800/80 hover:text-[#FF6900] dark:hover:text-[#FF6900] font-medium"
                      }`}
                  >
                    <item.icon size={16} className="mr-2.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Button>
                ),
              )}
            </TooltipProvider>
          </div>
        </div>
      </ScrollArea>

      {/* User profile section - Fixed & Pinned at bottom */}
      <div
        className={cn(
          "shrink-0 w-full border-t border-gray-200 dark:border-neutral-800/80 bg-white dark:bg-[#09090B] transition-colors",
          isMinimized ? "p-2 flex justify-center" : "p-3 flex items-center",
        )}
      >
        {isMinimized ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden cursor-pointer flex items-center justify-center border border-gray-200 dark:border-neutral-700">
                <Image
                  src={userAvatar}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  onError={() => setUserAvatar("/placeholder.svg")}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="w-auto p-0">
              <div className="p-3 w-60 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden shrink-0 border border-gray-200 dark:border-neutral-700">
                    <Image
                      src={userAvatar}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      onError={() => setUserAvatar("/placeholder.svg")}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">{userName}</p>
                    <p className="text-[11px] text-gray-500 dark:text-neutral-400 truncate">{currentDate}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/50 cursor-pointer text-xs"
                >
                  <LogOut size={14} className="mr-1.5" />
                  Sign Out
                </Button>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden shrink-0 border border-gray-200 dark:border-neutral-700">
                <Image
                  src={userAvatar}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  onError={() => setUserAvatar("/placeholder.svg")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 dark:text-neutral-100 truncate">{userName}</p>
                <p className="text-[10px] text-gray-500 dark:text-neutral-400 truncate">{currentDate}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer ml-1 shrink-0"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidenav;
