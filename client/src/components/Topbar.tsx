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
  const name = displayName || email?.split("@")[0] || "U";;
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

        <img
          src="/log/mailmintt.png"
          className="h-10 object-contain"
        />

        <p className="text-xl font-semibold">
          Mailmint
        </p>
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
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
            {initial}
          </div>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-md shadow-lg p-5">
            <div className="flex flex-col items-center gap-3">

              <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl">
                {initial}
              </div>

              <h2 className="text-lg font-semibold">
                Hi, {name}
              </h2>

              <p className="text-gray-500 text-sm break-all">
                {email}
              </p>

              <button
                onClick={onLogout}
                className="mt-3 w-full py-2 rounded-lg border text-red-600 hover:bg-red-50"
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