import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";

export default function AddPropertyPage() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)] pb-14 bg-gray-50 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-4xl mx-auto p-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-[#FF6900]/10 border border-[#FF6900]/20 flex items-center justify-center text-[#FF6900] mb-4 shadow-sm">
          <PlusCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-2">Add New Property</h1>
        <p className="text-gray-500 dark:text-neutral-400 max-w-md">
          Property listing creation workflow is managed under the Property Management section.
        </p>
      </div>
    </ScrollArea>
  );
}
