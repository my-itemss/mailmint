import { BiSend, BiPencil } from "react-icons/bi";
import {
  IoStarOutline,
  IoTimeOutline,
  IoDocumentOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import { MdInbox, MdOutlineShoppingBag } from "react-icons/md";

interface SidebarProps {
  onCompose: () => void;
  collapsed: boolean;
  activeItem: string; 
  setActiveItem: (name: string) => void; 
}

export default function Sidebar({ onCompose, collapsed, activeItem, setActiveItem }: SidebarProps) {
  const menuItems = [
    { name: "Inbox", icon: <MdInbox size={20} /> },
//    { name: "Starred", icon: <IoStarOutline size={20} /> },
//    { name: "Snoozed", icon: <IoTimeOutline size={20} /> },
    { name: "Sent", icon: <BiSend size={20} /> },
//    { name: "Drafts", icon: <IoDocumentOutline size={20} /> },
//   { name: "Purchases", icon: <MdOutlineShoppingBag size={20} /> },
//    { name: "More", icon: <IoChevronDownOutline size={20} /> },
  ];

  return (
    <div className={`${collapsed ? "w-[72px]" : "w-[256px]"} bg-[#f6f8fc] h-full pt-2 transition-all duration-300`}>
      {/* Compose Button */}
      <div className="px-2 mb-4">
        <button
          onClick={onCompose}
          className="bg-[#c2e7ff] hover:shadow-md transition px-5 py-4 rounded-2xl flex items-center gap-4 text-sm font-medium text-[#041e49]"
        >
          <BiPencil size={22} />
          {!collapsed && <span>Compose</span>}
        </button>
      </div>

      <nav className="flex-1 pr-2">
        {menuItems.map((item) => {
          const isActive = activeItem === item.name;
          return (
            <div
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`
                flex items-center gap-4 px-4 py-2 cursor-pointer rounded-r-full
                ${isActive ? "bg-[#d3e3fd] text-[#041e49] font-semibold" : "hover:bg-[#eaebef] text-gray-700"}
              `}
            >
              {item.icon}
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
