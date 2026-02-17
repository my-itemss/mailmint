// 'use client';
// import { useState, useEffect } from 'react';

// export default function GmailLoading() {
//   const [progress, setProgress] = useState(0);
//   const [isDone, setIsDone] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setTimeout(() => setIsDone(true), 400); // Small pause at 100%
//           return 100;
//         }
        
//         // Gmail logic: Fast at first, slows down near the end
//         let step = Math.random() * 20; 
//         if (prev > 70) step = Math.random() * 5;
//         if (prev > 90) step = 1;
        
//         return prev + step;
//       });
//     }, 4000); // Updates every 0.4 seconds

//     return () => clearInterval(interval);
//   }, []);

//   if (!isDone) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//         {/* Your Logo */}
//         <img 
//           src="/log/mailmint.png" 
//           alt="MailMint" 
//           className="w-62 mb-12 opacity-90" 
//         />
        
//         {/* Red Progress Bar (No percentage) */}
//         <div className="loader-track">
//           <div 
//             className="loader-fill" 
//             style={{ width: `${progress}%` }} 
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-reveal p-8">
//       <header className="flex justify-between items-center border-b pb-4">
//         <h1 className="text-xl font-bold text-red-600">MailMint</h1>
//         <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
//       </header>
//       <main className="mt-10">
//         <h2 className="text-2xl font-semibold">Your Inbox</h2>
//         <p className="text-gray-500 mt-2">Welcome back! Everything is loaded.</p>
//       </main>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { createMailbox } from "../../lib/api";

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);
  const router = useRouter();

  const handleFinish = async () => {
    setLoadingDone(true);
    try {
      const data = await createMailbox();
      router.push(`/inbox/${data.email}`);
    } catch (err) {
      alert("Failed to create mailbox");
    }
  };

  if (!loadingDone) {
    return <Loader onFinish={handleFinish} />;
  }

  return null;
}
