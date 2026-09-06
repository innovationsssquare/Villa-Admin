import Ordersmanagement from "@/components/Allordercomponents/ordermanagement";
import Allorderstats from "@/components/Allordercomponents/Statcard";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
  return (
    <ScrollArea className="p-4 bg-gray-50 dark:bg-[#09090B] h-[calc(100vh-64px)] pb-14 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* <Allorderstats /> */}

      <Ordersmanagement />
    </ScrollArea>
  );
};

export default page;
