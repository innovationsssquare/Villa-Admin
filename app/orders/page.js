import Ordersmanagement from "@/components/Allordercomponents/ordermanagement";
import Allorderstats from "@/components/Allordercomponents/Statcard";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
  return (
    <ScrollArea className="p-4 bg-gray-50 h-screen pb-14">
      {/* <Allorderstats /> */}

      <Ordersmanagement />
    </ScrollArea>
  );
};

export default page;
