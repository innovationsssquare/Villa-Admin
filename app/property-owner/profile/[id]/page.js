import SellerProfile from "@/components/Productsellercomponents/seller-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
  return (
    <ScrollArea className="pb-14 h-screen">
      <SellerProfile />
    </ScrollArea>
  );
};

export default page;
