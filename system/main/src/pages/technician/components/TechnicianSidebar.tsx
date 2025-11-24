import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  LogOut 
} from "lucide-react";

interface TechnicianSidebarProps {
  currentPage: string;
  onNavigate: (page: "dashboard" | "appointments" | "profile") => void;
  className?: string;
}

export function TechnicianSidebar({ currentPage, onNavigate, className = "" }: TechnicianSidebarProps) {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", name: "Appointments", icon: Calendar },
    { id: "profile", name: "Profile", icon: User },
  ];

  return (
    <div className={`w-64 bg-[#0B4F6C] text-white flex flex-col h-full ${className}`}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-[#4DBDCC] flex items-center justify-center bg-[#4DBDCC] p-1.5 shadow-lg">
          <img 
            src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
            alt="NCPS Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wide">NCPS</span>
          <span className="text-[10px] font-bold text-[#4DBDCC] tracking-widest">TECHNICIAN</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 mt-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentPage;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as "dashboard" | "appointments" | "profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white/20 font-medium shadow-sm"
                  : "hover:bg-white/10 hover:translate-x-1"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#4DBDCC]" : "text-gray-300"}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Log out button */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
