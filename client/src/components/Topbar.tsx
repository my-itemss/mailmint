import { useState, useRef, useEffect } from "react";
import { IoReorderThreeOutline, IoSearchOutline } from "react-icons/io5";
import { deleteWholeUser } from "../../lib/api"; 

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
  const [isDeleting, setIsDeleting] = useState(false); 
  const ref = useRef<HTMLDivElement>(null);

  const name = displayName || email?.split("@")[0] || "U";
  const initial = name.charAt(0).toUpperCase();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the account for ${email}?`
    );

    if (!confirmed) return;

    const password = window.prompt("Enter your password to confirm account deletion:");
    if (!password) return;

    try {
      setIsDeleting(true);
      await deleteWholeUser(email, password);
      alert("Account deleted successfully.");
      onLogout();
    } catch (error: any) {
      alert(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

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
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 min-w-[220px]">
        <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-200 rounded-full transition">
          <IoReorderThreeOutline size={36} />
        </button>
        <img src="/log/mailmintt.png" className="h-10 object-contain" alt="Logo" />
        <p className="text-xl font-semibold">Mailmint</p>
      </div>

  
      <div className="flex-1 max-w-[720px]">
        <div className="flex items-center gap-3 bg-[#eaf1fb] px-4 py-3 rounded-full hover:shadow-sm transition">
          <IoSearchOutline size={20} className="text-gray-600" />
          <input type="text" placeholder="Search mail" className="bg-transparent outline-none w-full text-sm" />
        </div>
      </div>

    
      <div ref={ref} className="relative">
        <div onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium shadow-sm hover:opacity-90 transition">
            {initial}
          </div>
        </div>

        {open && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl p-6 border border-gray-100 z-50">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-inner mb-4">
                {initial}
              </div>
              <h2 className="text-xl font-bold text-gray-800">Hi, {name}!</h2>
              <p className="text-gray-500 text-sm mb-6 truncate w-full text-center">{email}</p>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete User"}
                </button>
                <button
                  onClick={onLogout}
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
