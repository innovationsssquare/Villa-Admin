"use client";
import Logo from "@/public/Loginasset/Logo.png";
import Logoname from "@/public/Loginasset/Logoname.png";
import { useRouter } from "next/navigation";
import ResponsiveAuthModal from "@/components/Logincomponents/responsive-auth-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();

  const handleModalClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <ResponsiveAuthModal autoOpen={true} onOpenChange={handleModalClose} />
      </div>
    </div>
  );
}
