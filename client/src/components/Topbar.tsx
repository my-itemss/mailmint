import { useState, useRef, useEffect } from "react";
import { IoReorderThreeOutline, IoSearchOutline } from "react-icons/io5";

interface TopbarProps {
  email: string;
  displayName?: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export default function Topbar({
  email,
  displayName,
  onLogout,
  onToggleSidebar,
}: TopbarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Direct display name usage
  const name = displayName || email?.split("@")[0] || "U";
  const initial = name.charAt(0).toUpperCase();

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
    <div className="h-16 bg-[#f6f8fc] flex items-center justify-between px-4 gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-[220px]">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-200 rounded-full transition"
        >
          <IoReorderThreeOutline size={36} />
        </button>

        <img src="/log/mailmintt.png" className="h-10 object-contain" />

        <p className="text-xl font-semibold">Mailmint</p>
      </div>

      {/* SEARCH */}
      <div className="flex-1 max-w-[720px]">
        <div className="flex items-center gap-3 bg-[#eaf1fb] px-4 py-3 rounded-full hover:shadow-sm transition">
          <IoSearchOutline size={20} className="text-gray-600" />

          <input
            type="text"
            placeholder="Search mail"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* PROFILE */}
      <div ref={ref} className="relative">
        {/* Avatar + Name */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            {initial}
          </div>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
  <div className="flex flex-col items-center">
    {/* Profile Section */}
    <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-inner mb-4">
      {initial}
    </div>

    <h2 className="text-xl font-bold text-gray-800">Hi, {name}!</h2>
    <p className="text-gray-500 text-sm mb-6">{email}</p>

    {/* Button Container */}
    <div className="grid grid-cols-2 gap-3 w-full">
       <button 
        className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
      >
        Delete User
      </button>
      <button 
        className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
      >
        Logout
      </button>
    </div>
  </div>
</div>

        )}
      </div>
    </div>
  );
}
