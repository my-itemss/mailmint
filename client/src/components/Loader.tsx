"use client";
import { useState, useEffect } from "react";

interface LoaderProps {
  onFinish: () => void;
}

export default function Loader({ onFinish }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 400);
          return 100;
        }

        let step = Math.random() * 20;
        if (prev > 70) step = Math.random() * 5;
        if (prev > 90) step = 1;

        return prev + step;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        src="/log/mailmint.png"
        alt="MailMint"
        className="w-52 mb-12 opacity-90"
      />

      <div className="loader-track">
        <div
          className="loader-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
