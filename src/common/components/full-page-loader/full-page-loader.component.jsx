"use client";

import { PanelsTopLeft } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background-secondary/80 backdrop-blur-md"
      role="status"
      aria-label="Loading"
    >
      {/* Container */}
      <div className="flex flex-col items-center gap-8">
        {/* Logo + Ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow */}
          <div className="absolute h-36 w-36 rounded-full bg-primary-500/20 blur-2xl animate-spin" />

          {/* Rotating gradient ring */}
          <div className="relative h-20 w-20 rounded-full animate-spin-slow bg-[conic-gradient(from_0deg,theme(colors.primary.500),theme(colors.primary.300),theme(colors.primary.600),theme(colors.primary.500))] p-[3px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background-secondary">
              {/* Center icon container */}
              <div className="flex h-10 w-10 items-center animate-spin-slow justify-center rounded-xl bg-primary-500 text-white shadow-xl shadow-primary-500/30">
                <PanelsTopLeft className="h-7 w-7" />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-foreground tracking-wide">
            Loading workspace
          </p>
        </div>  */}
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-loading-bar {
          animation: loading-bar 1.2s linear infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
