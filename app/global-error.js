"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCcw, XCircle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const errorMessage = error?.message || "An unexpected error occurred";

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <XCircle className="w-24 h-24 text-red-500" />
            </motion.div>
          </div>
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <CardTitle className="text-center">
              Oops! Something went wrong
            </CardTitle>
            <CardDescription className="text-center mt-2">
              We apologize for the inconvenience.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          ></motion.div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="bordered"
              onClick={() => (window.location.href = "/")}
            >
              Go to Homepage
            </Button>
          </motion.div>
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              onClick={() => reset()}
              className="px-8 py-0.5 rounded-sm w-48  border-none bg-[#106C83] "
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="text-white">Try again</span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  );
}
