"use client";
import { useEffect, useState } from "react";

interface Props {
  onFinish: () => void;
}

export default function Loader({ onFinish }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + 8;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
     <img 
     src="/log/mailmint.png"
     className="w-66 mb-7"
     >
     </img>

      <div className="w-72 h-1 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full bg-red-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
