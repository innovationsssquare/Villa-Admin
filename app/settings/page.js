import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SettingsPage() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)] pb-14 bg-gray-50 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">General Settings</h1>

          <div className="space-y-3">
            <SettingsItem href="/settings/account" label="Account Settings" />
            <SettingsItem href="/settings/security" label="Security Settings" />
            <SettingsItem href="/settings/bank" label="Bank & Withdrawal" />
            <SettingsItem href="/settings/management" label="Account Management" />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function SettingsItem({ href, label }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/60 hover:bg-[#FFF1E6] dark:hover:bg-neutral-800/60 transition-colors group"
    >
      <span className="text-gray-900 dark:text-neutral-200 text-sm font-medium group-hover:text-[#FF6900] transition-colors">{label}</span>
      <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500 group-hover:text-[#FF6900] transition-colors" />
    </Link>
  );
}
