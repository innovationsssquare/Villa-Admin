import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="w-full mx-auto p-4 md:p-6">
      <div className="rounded-md border border-border bg-card p-6">
        <h1 className="text-lg font-medium text-muted-foreground mb-4">General Settings</h1>

        <div className="space-y-3">
          <SettingsItem href="/settings/account" label="Account Settings" />
          <SettingsItem href="/settings/security" label="Security Settings" />
          <SettingsItem href="/settings/bank" label="Bank & Withdrawal" />
          <SettingsItem href="/settings/management" label="Account Management" />
        </div>
      </div>
    </div>
  )
}

function SettingsItem({ href, label }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-accent/5 transition-colors"
    >
      <span className="text-foreground text-sm">{label}</span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  )
}
