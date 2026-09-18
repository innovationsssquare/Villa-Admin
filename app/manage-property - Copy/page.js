import React from "react";
import PropertyManagement from "@/components/Propertymanagecomponent/property-management";
import Statcard from "@/components/Productsellercomponents/Statcard";
import { ScrollArea } from "@/components/ui/scroll-area";

const page = () => {
  return (
    <ScrollArea className="pb-14 bg-gray-50 dark:bg-[#09090B] h-[calc(100vh-64px)] text-neutral-900 dark:text-neutral-100 transition-colors">
     <section className="p-4 space-y-4">
      <Statcard/>

     <PropertyManagement />
     </section>
    </ScrollArea>
  );
};

export default page;
