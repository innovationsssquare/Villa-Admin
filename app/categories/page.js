"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeasurementsTable } from "@/components/Categoriescomponents/measurements-table";
import { TaxTable } from "@/components/Categoriescomponents/tax-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Categoriestable } from "@/components/Categoriescomponents/Categoriestable";
import { Subcategorytable } from "@/components/Categoriescomponents/Subcategorytable";

export default function TableTabs() {
  const [activeTab, setActiveTab] = useState("Category");

  return (
    <ScrollArea className="p-4 h-screen pb-14">
      <Tabs defaultValue="Category" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-[500px] grid-cols-4 gap-2 mb-4">
          <TabsTrigger
            value="Category"
            className={`text-sm border-0 font-medium  cursor-pointer rounded-md px-6 py-2  data-[state=active]:bg-[#106C83] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-gray-300 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50 ${
              activeTab === "Category" ? "border-b-2 border-[#106C83]" : ""
            }`}
          >
            Category 
          </TabsTrigger>
        
          
        </TabsList>

      
        <TabsContent value="Category" className="mt-0">
          <Categoriestable />
        </TabsContent>
       
      </Tabs>
    </ScrollArea>
  );
}
