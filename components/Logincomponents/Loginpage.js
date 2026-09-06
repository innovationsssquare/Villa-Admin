"use client";

import Image from "next/image";
import Logo from "@/public/Asset/applogo.png";
import { AdminLoginForm } from "@/components/Logincomponents/responsive-auth-modal";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-950 via-[#14110E] to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FF6900]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#EA580C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-6 space-y-2 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md p-2.5 shadow-xl border border-white/20 flex items-center justify-center">
            <Image
              src={Logo}
              alt="The Villa Camp Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-orange-500/20 text-xs text-orange-200 font-medium">
            <Sparkles className="h-3 w-3 text-orange-400" />
            <span>Management Console</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/95 dark:bg-[#121215]/95 backdrop-blur-xl rounded-3xl p-7 shadow-2xl border border-white/20 dark:border-neutral-800">
          <AdminLoginForm />
        </div>

        {/* Bottom Credits */}
        <div className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} The Villa Camp & Resort. All rights reserved.
        </div>
      </div>
    </div>
  );
}
