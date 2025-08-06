import Ownerstats from "@/components/Productsellercomponents/Ownerstat";
import Statcard from "@/components/Productsellercomponents/Statcard";
import SellersManagement from "@/components/Productsellercomponents/sellers-management";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
  return (
    <ScrollArea className="pb-14 bg-gray-50 h-screen">
     <section className="p-4">
      <Ownerstats/>

      <SellersManagement />
     </section>
    </ScrollArea>
  );
};

export default page;
