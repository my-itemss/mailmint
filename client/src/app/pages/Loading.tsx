import React, { useState, useEffect } from 'react';

const Loading = () => {

      const [progress, setProgress] = useState(0);
    
      useEffect(() => {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => setIsDone(true), 400); // Small pause at 100%
              return 100;
            }
            
            // Gmail logic: Fast at first, slows down near the end
            let step = Math.random() * 20; 
            if (prev > 70) step = Math.random() * 5;
            if (prev > 90) step = 1;
            
            return prev + step;
          });
        }, 1000); // Updates every 0.4 seconds
    
        return () => clearInterval(interval);
      }, []);
    
  return (
<>
<div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
  {/* The logo */}
  <img 
    src="/log/mailmint.png" 
    alt="MailMint" 
    className="w-70 mb-12 opacity-90" 
  />

  {/* The loader track (now forced to center by items-center) */}
  <div className="loader-track">
    <div 
      className="loader-fill" 
      style={{ width: `${progress}%` }} 
    />
  </div>
</div>

</>
)
}

export default Loading