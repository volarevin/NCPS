import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Users, 
  FileText, 
  HardHat,
  LogOut 
} from "lucide-react";

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Sidebar({ currentPage = "Dashboard", onNavigate }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Manage Services", icon: Wrench },
    { name: "Appointments", icon: Calendar },
    { name: "Technicians", icon: HardHat },
    { name: "User Account", icon: Users },
    { name: "Reports", icon: FileText },
  ];

  return (
    <div className="w-56 bg-[#0B4F6C] text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-16 h-16 rounded-full border-2 border-[#0B4F6C] flex items-center justify-center overflow-hidden bg-[#4DBDCC] p-2">
          <img 
            src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
                alt="Security Camera"
                className="w-14 h-14"
          />
        </div>
        <span className="text-2xl font-bold">NCPS</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              onClick={() => onNavigate?.(item.name)}
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded cursor-pointer transition-colors ${
                item.name === currentPage
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
          );
        })}
      </nav>

      {/* Log out button */}
      <div className="p-4">
        <button className="w-full bg-[#A8CBDA] text-[#0B4F6C] py-3 rounded-lg hover:bg-[#98BBD0] transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
