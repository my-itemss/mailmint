interface TopbarProps {
  email: string;
  displayName: string;
  onLogout: () => void; // Add this
}

export default function Topbar({ email, displayName, onLogout }: TopbarProps) {
  return (
    <div className="h-16 bg-[#f8fafd] border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Mail</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{displayName}({email})</span>
        <button
          onClick={onLogout}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}