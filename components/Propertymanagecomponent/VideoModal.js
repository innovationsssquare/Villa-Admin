import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const VideoModal = ({ trigger, videoUrl, thumbnailSrc }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modal = isOpen
    ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          {/* Reduced blur backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          {/* Video container with vertical aspect ratio for reel-style */}
          <div className="relative z-10 w-full max-w-sm max-h-[90vh] aspect-[9/16]">
            <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
              {/* Close button with enhanced styling */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Video element with enhanced styling */}
              <video
                className="w-full h-full object-cover rounded-xl"
                controls
                autoPlay
                poster={thumbnailSrc}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <Button
            variant="secondary"
            size="lg"
            className="  hover:bg-orange-400 w-20 h-16 bg-orange-300    rounded-lg flex flex-col gap-0 justify-center items-center  text-white z-10"
          >
            <Play className="w-4 h-4 mr-1 fill-white" />
            <span className="text-xs font-medium">Video</span>
          </Button>
        )}
      </div>
      {modal}
    </>
  );
};

export default VideoModal;
