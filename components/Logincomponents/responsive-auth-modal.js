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
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export const AdminLoginForm = ({ onSuccess }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken(true);

      const res = await fetch("/api/Login/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Google authentication failed");
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
      console.error("Google sign-in error:", err);
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        // User voluntarily closed popup
        return;
      }
      setError(err.message || "Failed to authenticate with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

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
    <div className="space-y-5 w-full text-left">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-[#FF6900] to-[#FF8733] rounded-2xl flex items-center justify-center shadow-md shadow-[#FF6900]/25 mb-3">
          <KeyRound className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
          Admin Portal
        </h2>
        <p className="text-xs text-gray-500 dark:text-neutral-400">
          Sign in to access your resort executive console
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{error}</div>
        </div>
      )}

      {/* Option B: Primary 1-Click Google Sign-In */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800/80 text-gray-800 dark:text-neutral-100 font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {googleLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#FF6900]" />
              <span>Connecting with Google...</span>
            </>
          ) : (
            <>
              {/* Google Official 4-Color SVG Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="group-hover:text-black dark:group-hover:text-white transition-colors">
                Continue with Google
              </span>
            </>
          )}
        </button>

        {/* Elegant Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-neutral-800 w-full" />
          <span className="bg-white dark:bg-[#121215] px-3 text-[11px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-wider shrink-0">
            or sign in with password
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username / Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block">
            Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
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
              className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-900/80 focus:bg-white dark:focus:bg-neutral-900 border border-gray-200 dark:border-neutral-800 focus:border-[#FF6900] rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6900]/20 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
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
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-900/80 focus:bg-white dark:focus:bg-neutral-900 border border-gray-200 dark:border-neutral-800 focus:border-[#FF6900] rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#FF6900]/20 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 font-mono"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
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
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 dark:border-neutral-700 text-[#FF6900] focus:ring-[#FF6900] h-3.5 w-3.5 accent-[#FF6900]"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || googleLoading}
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
