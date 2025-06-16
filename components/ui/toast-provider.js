"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cva } from "class-variance-authority"
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

// Toast variants and styles
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "border-red-500 bg-red-500 text-white",
        success: "border-[#106C83] bg-[#106C83] text-white",
        warning: "border-yellow-500 bg-yellow-500 text-white",
        info: "border-blue-500 bg-blue-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

// Icon map for variants
const variantIcons = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  destructive: XCircle,
  info: Info,
}

const Toast = React.forwardRef(({ className, variant, onClose, children, ...props }, ref) => {
  const Icon = variantIcons[variant] || Info

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50}}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0 }}
      className={cn(
        toastVariants({ variant }),
        "hover:scale-[1.02] active:scale-[0.98] transition-transform",
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-1 opacity-90" />
        <div className="flex-1">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/70 transition-opacity hover:text-foreground focus:outline-none focus:ring-2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
})
Toast.displayName = "Toast"

// Toast context and provider
const ToastContext = React.createContext(undefined)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const addToast = React.useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    if (toast.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const contextValue = React.useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {isMounted &&
        createPortal(
          <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse md:max-w-[420px]">
            <AnimatePresence initial={false}>
              {toasts.map((toast) => (
                <Toast
                  key={toast.id}
                  variant={toast.variant}
                  onClose={() => removeToast(toast.id)}
                >
                  <div className="flex flex-col gap-1">
                    {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
                    {toast.description && <div className="text-xs opacity-90">{toast.description}</div>}
                  </div>
                </Toast>
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export { Toast, toastVariants }
