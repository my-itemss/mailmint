"use client";
import { useEffect, useState } from "react";

interface Props {
  onFinish: () => void;
}

export default function Loader({ onFinish }: Props) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Phase 1: Rapid initial jump to 30%
    const timer1 = setTimeout(() => setProgress(30), 100);
    
    // Phase 2: Staggered "bursts" to mimic real asset loading
    const timer2 = setTimeout(() => setProgress(65), 1200);
    const timer3 = setTimeout(() => setProgress(85), 2200);
    const timer4 = setTimeout(() => {
      setProgress(100);
      // Phase 3: Smooth exit transition
      setTimeout(() => setIsExiting(true), 500);
      setTimeout(onFinish, 1100);
    }, 3200);

    return () => {
      [timer1, timer2, timer3, timer4].forEach(clearTimeout);
    };
  }, [onFinish]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] transition-all duration-700 ease-in-out ${isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}>
      {/* Custom keyframes for the "Gmail Pop" */}
      <style jsx>{`
        @keyframes gmail-pop {
          0% { transform: scale(0.6); opacity: 0; filter: blur(8px); }
          50% { transform: scale(1.08); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-gmail-pop {
          animation: gmail-pop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <div className="flex flex-col items-center w-full max-w-[300px]">
        {/* Logo with entrance animation */}
        <div className="animate-gmail-pop">
          <img 
            src="/log/mailmintt.png" 
            className="w-50 mb-14 select-none pointer-events-none" 
            alt="Logo"
          />
        </div>

        {/* The Track (Standard Google Workspace 4px height) */}
        <div className="w-full h-[4px] bg-[#E8EAED] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#DB4437] transition-all duration-[1000ms] ease-out shadow-[0_0_8px_rgba(219,68,55,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Subtle loading text beneath the bar */}
        <div className="mt-4 text-[10px] text-gray-400 font-bold tracking-widest uppercase animate-pulse">
          {progress < 100 ? "Syncing" : "Ready"}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-12 flex flex-col items-center opacity-70">
        <span className="text-gray-400 text-[9px] font-bold tracking-[0.3em] uppercase mb-1">
          From
        </span>
        <div className="flex items-center space-x-1.5">
          <span className="text-[#5F6368] text-xl font-semibold tracking-tight">MailMint</span>
        </div>
      </div>
    </div>
  );
}
