import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Users, 
  FileText, 
  HardHat,
  LogOut,
  X
} from "lucide-react";

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({ currentPage = "Dashboard", onNavigate, mobileMenuOpen = false, setMobileMenuOpen }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Manage Services", icon: Wrench },
    { name: "Appointments", icon: Calendar },
    { name: "Technicians", icon: HardHat },
    { name: "User Account", icon: Users },
    { name: "Reports", icon: FileText },
  ];

  const handleNavigation = (page: string) => {
    onNavigate?.(page);
    setMobileMenuOpen?.(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen?.(false)}
        />
      )}
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0B4F6C] text-white flex flex-col h-screen shadow-xl transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-16 h-16 rounded-full border-2 border-[#0B4F6C] flex items-center justify-center overflow-hidden bg-[#4DBDCC] p-2">
            <img 
              src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
                  alt="Security Camera"
                  className="w-14 h-14"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-2xl font-bold leading-none">NCPS</span>
            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Admin</span>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen?.(false)}
            className="lg:hidden text-white hover:bg-[#145A75] p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 mt-8 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded cursor-pointer transition-colors ${
                  item.name === currentPage
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Log out button */}
        <div className="p-4">
          <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}
