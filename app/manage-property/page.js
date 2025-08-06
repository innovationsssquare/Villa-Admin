import React from "react";
import PropertyManagement from "@/components/Propertymanagecomponent/property-management";
import Statcard from "@/components/Productsellercomponents/Statcard";
import { ScrollArea } from "@/components/ui/scroll-area";

const page = () => {
  return (
    <ScrollArea className="pb-14 bg-gray-50 h-screen">
     <section className="p-4">
      <Statcard/>

     <PropertyManagement />
     </section>
    </ScrollArea>
  );
};

export default page;
