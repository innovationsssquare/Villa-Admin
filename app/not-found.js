import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-[#106C83]/20 blur-lg animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-lg">
              <FileQuestion size={80} className="text-[#106C83]" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Not Found</h2>
        <p className="text-gray-600 mb-8">
         {` Could not find the requested resource. The page you're looking for may
          have been moved or doesn't exist.`}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#106C83] text-white font-medium transition-all hover:bg-[#106C83]/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#106C83]/50 focus:ring-offset-2"
        >
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
