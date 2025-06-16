"use client"

import { useState, useEffect } from "react"
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { LogIn, Loader2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"


const ResponsiveAuthModal = ({ autoOpen = false, onOpenChange }) => {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [appleLoading, setAppleLoading] = useState(false) 
 const [open, setOpen] = useState(autoOpen)
  const router = useRouter()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (autoOpen) {
      setOpen(true)
    }
  }, [autoOpen])

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleLogin = async (providerType) => {
      const setLoading = providerType === "google" ? setGoogleLoading : setAppleLoading
    setLoading(true)
    try {
      const provider = providerType === "google" ? new GoogleAuthProvider() : new OAuthProvider("apple.com")

      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      const res = await fetch("/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      if (!res.ok) throw new Error("Login API failed")

      const data = await res.json()

      // Store token in cookies
      Cookies.set("token", data.token, { expires: 7 })
      const { fullName, profilePic } = data.admin || {};
    if (fullName) localStorage.setItem("fullName", fullName);
    if (profilePic) localStorage.setItem("profilePic", profilePic);
      // Close modal and redirect
      handleOpenChange(false)
      router.push("/")
    } catch (err) {
      console.error(`${providerType} login failed:`, err)
    } finally {
      setLoading(false)
    }
  }

  const AuthContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <LogIn className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {/* Auth Buttons */}
      <div className="space-y-4">
        {/* Google Sign In */}
        <Button
          onClick={() => handleLogin("google")}
          disabled={googleLoading || appleLoading}
          className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md group"
          variant="outline"
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <svg className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </Button>

        {/* Apple Sign In */}
        <Button
          onClick={() => handleLogin("apple")}
          disabled={googleLoading || appleLoading}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white transition-all duration-200 hover:shadow-md group"
        >
          {appleLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <svg
              className="mr-3 h-5 w-5 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          )}
          {appleLoading ? "Signing in..." : "Continue with Apple"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        {/* Email option placeholder */}
        <Button
          variant="outline"
          className="w-full h-12 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all duration-200"
          disabled
        >
          Continue with Email (Coming Soon)
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-center text-gray-500">
        By signing in, you agree to our{" "}
        <a href="#" className="underline hover:text-gray-700">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-gray-700">
          Privacy Policy
        </a>
      </p>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        {!autoOpen && (
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
            >
              <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Sign In
            </Button>
          </DrawerTrigger>
        )}

        <DrawerContent className="max-w-md mx-auto bg-white">
          <div className="mx-auto w-full max-w-sm">
            {/* <DrawerHeader className="text-center">
              <DrawerTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome Back
              </DrawerTitle>
              <DrawerDescription className="text-gray-600">Sign in to your account to continue</DrawerDescription>
            </DrawerHeader> */}

            <div className="p-6">
              <AuthContent />
            </div>

            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!autoOpen && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
          >
            <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Sign In
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md bg-white">
        {/* <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-gray-600">Sign in to your account to continue</DialogDescription>
        </DialogHeader> */}

        <div className="p-6">
          <AuthContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ResponsiveAuthModal
