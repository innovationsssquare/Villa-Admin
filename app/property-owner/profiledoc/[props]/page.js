import SellerDocProfile from "@/components/Productsellercomponents/SellerDocProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
  return (
    <ScrollArea className="pb-14 h-screen">
      <SellerDocProfile/>
    </ScrollArea>
  );
};

export default page;
