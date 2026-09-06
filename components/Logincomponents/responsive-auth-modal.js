"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  LogIn,
  Loader2,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const AdminLoginForm = ({ onSuccess }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please enter both username/email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: identifier.trim(),
          username: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid username/email or password");
      }

      // Store token in cookies
      Cookies.set("token", data.token, { expires: rememberMe ? 30 : 7 });

      const { fullName, profilePic } = data.admin || {};
      if (fullName) localStorage.setItem("fullName", fullName);
      if (profilePic) localStorage.setItem("profilePic", profilePic);

      onSuccess?.();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-[#FF6900] to-[#FF8733] rounded-2xl flex items-center justify-center shadow-md shadow-[#FF6900]/25 mb-3">
          <KeyRound className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Admin Portal
        </h2>
        <p className="text-xs text-gray-500">
          Enter your admin credentials to access the console
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username / Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 block">
            Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError(null);
              }}
              placeholder="admin@thevillacamp.com or username"
              className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#FF6900] rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6900]/20 text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700 block">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#FF6900] rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6900]/20 text-gray-900 placeholder:text-gray-400 font-mono"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900] h-3.5 w-3.5 accent-[#FF6900]"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#FF6900] hover:bg-[#E05D00] text-white font-semibold rounded-xl shadow-md shadow-[#FF6900]/25 transition-all duration-200 text-sm mt-2 gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign In to Console
            </>
          )}
        </Button>
      </form>

      {/* Security badge footer */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Authorized Staff Only · 256-Bit TLS Encryption</span>
      </div>
    </div>
  );
};

const ResponsiveAuthModal = ({ autoOpen = false, onOpenChange }) => {
  const [open, setOpen] = useState(autoOpen);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
    }
  }, [autoOpen]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        {!autoOpen && (
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#FF6900] text-white hover:bg-[#E05D00] shadow-sm shadow-[#FF6900]/25"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </DrawerTrigger>
        )}

        <DrawerContent className="max-w-md mx-auto bg-white p-6">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Sign In</DrawerTitle>
            <DrawerDescription>Sign in with username and password</DrawerDescription>
          </DrawerHeader>

          <AdminLoginForm onSuccess={() => handleOpenChange(false)} />

          <DrawerFooter className="pt-2 px-0">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!autoOpen && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#FF6900] text-white hover:bg-[#E05D00] shadow-sm shadow-[#FF6900]/25"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl border border-gray-100 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>Sign in with username and password</DialogDescription>
        </DialogHeader>

        <AdminLoginForm onSuccess={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveAuthModal;
