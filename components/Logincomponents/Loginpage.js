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
