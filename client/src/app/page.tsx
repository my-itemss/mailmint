'use client';
import { useState, useEffect } from 'react';

export default function GmailLoading() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 1500); 
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <img src="/log/mailmint.png" alt="Logo" className="w-70 mb-8" />
        <div className="w-64">
          <div className="progress-container">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 font-sans">
            <span>Loading MailMint...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="p-10 animate-in fade-in duration-700">
      <p>hellooo</p>
    </main>
  );
}
