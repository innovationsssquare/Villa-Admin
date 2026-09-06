import Customerservicecard from "@/components/Customerservicecomponent/Customerservicecard";
import ProjectTable from "@/components/Customerservicecomponent/project-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const page = () => {
  return (
    <ScrollArea className="h-[calc(100vh-64px)] pb-14 p-4 bg-gray-50 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-4">
        <Customerservicecard />
        <ProjectTable />
      </div>
    </ScrollArea>
  );
};

export default page;
