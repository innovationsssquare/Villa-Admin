import Ownerstats from "@/components/Productsellercomponents/Ownerstat";
import Statcard from "@/components/Productsellercomponents/Statcard";
import SellersManagement from "@/components/Productsellercomponents/sellers-management";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
  return (
    <ScrollArea className="pb-14 bg-gray-50 dark:bg-[#09090B] h-[calc(100vh-64px)] text-neutral-900 dark:text-neutral-100 transition-colors">
     <section className="p-4 space-y-4">
      <Ownerstats/>

      <SellersManagement />
     </section>
    </ScrollArea>
  );
};

export default page;
