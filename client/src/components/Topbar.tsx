import { useState, useRef, useEffect } from "react";

interface TopbarProps {
  email: string;
  displayName?: string;  
  onLogout: () => void;
}

export default function Topbar({ email, displayName, onLogout }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const safeName = displayName || email?.split("@")[0] || "U";
  const initial = safeName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-16 bg-[#f8fafd] flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Mail</h1>

      <div ref={ref} className="relative group">

        <div
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer select-none"
        >
          {initial}
        </div>

        {!open && (
          <div className="absolute right-0 mt-2 hidden group-hover:block z-50">
            <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
              <p className="font-semibold">MailMint Account</p>
              <p>{safeName}</p>
              <p className="text-gray-300">{email}</p>
            </div>
          </div>
        )}

        {open && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-md shadow-lg p-5">
            <div className="flex flex-col items-center gap-3">

              <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl">
                {initial}
              </div>

              <h2 className="text-lg font-semibold">
                Hi, {safeName}!
              </h2>

              <p className="text-gray-500 text-sm break-all">
                {email}
              </p>

              <button
                onClick={onLogout}
                className="mt-3 w-full py-2 rounded-lg border text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
