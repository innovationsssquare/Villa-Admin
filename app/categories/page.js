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
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-[400px] grid-cols-2 gap-2 mb-4 bg-transparent p-0">
          <TabsTrigger
            value="Category"
            onClick={() => setActiveTab("Category")}
            className={`text-sm font-semibold cursor-pointer rounded-xl px-6 py-2.5 transition-all shadow-sm ${
              activeTab === "Category"
                ? "!bg-[#FF6900] !text-white"
                : "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
            }`}
          >
            Category
          </TabsTrigger>
          <TabsTrigger
            value="location"
            onClick={() => setActiveTab("location")}
            className={`text-sm font-semibold cursor-pointer rounded-xl px-6 py-2.5 transition-all shadow-sm ${
              activeTab === "location"
                ? "!bg-[#FF6900] !text-white"
                : "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
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
