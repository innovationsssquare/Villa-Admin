"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeasurementsTable } from "@/components/Categoriescomponents/measurements-table";
import { TaxTable } from "@/components/Categoriescomponents/tax-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Categoriestable } from "@/components/Categoriescomponents/Categoriestable";
import { Subcategorytable } from "@/components/Categoriescomponents/Subcategorytable";
import LocationTable from "@/components/Categoriescomponents/LocationTable";

export default function TableTabs() {
  const [activeTab, setActiveTab] = useState("Category");

  return (
    <ScrollArea className="p-4 h-[calc(100vh-64px)] pb-14 bg-gray-50 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Tabs
        defaultValue="Category"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-[400px] grid-cols-2 gap-2 mb-4 bg-transparent p-0">
          <TabsTrigger
            value="Category"
            className={`text-sm font-semibold cursor-pointer rounded-xl px-6 py-2.5 transition-all data-[state=active]:bg-[#FF6900] data-[state=active]:text-white data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-neutral-900 data-[state=inactive]:border data-[state=inactive]:border-gray-200 dark:data-[state=inactive]:border-neutral-800 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-neutral-300 dark:data-[state=inactive]:hover:bg-neutral-800/50 ${
              activeTab === "Category" ? "shadow-sm" : ""
            }`}
          >
            Category
          </TabsTrigger>
          <TabsTrigger
            value="location"
            className={`text-sm font-semibold cursor-pointer rounded-xl px-6 py-2.5 transition-all data-[state=active]:bg-[#FF6900] data-[state=active]:text-white data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-neutral-900 data-[state=inactive]:border data-[state=inactive]:border-gray-200 dark:data-[state=inactive]:border-neutral-800 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-neutral-300 dark:data-[state=inactive]:hover:bg-neutral-800/50 ${
              activeTab === "location" ? "shadow-sm" : ""
            }`}
          >
            Location
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Category" className="mt-0">
          <Categoriestable />
        </TabsContent>
        <TabsContent value="location" className="mt-0">
          <LocationTable/>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
}
