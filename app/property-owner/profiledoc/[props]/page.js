import SellerDocProfile from "@/components/Productsellercomponents/SellerDocProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
  return (
    <ScrollArea className="pb-14 h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
      <SellerDocProfile/>
    </ScrollArea>
  );
};

export default page;
