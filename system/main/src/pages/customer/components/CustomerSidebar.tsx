import { LayoutDashboard, Calendar, User, LogOut } from 'lucide-react';
import { Button } from "../../../components/ui/button";

type Page = 'dashboard' | 'appointments' | 'profile';

interface CustomerSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function CustomerSidebar({ currentPage, onNavigate }: CustomerSidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments' as Page, label: 'Appointments', icon: Calendar },
    { id: 'profile' as Page, label: 'User Account', icon: User },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="w-64 bg-[#0B4F6C] text-white flex flex-col shadow-xl h-full">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 border-[#0B4F6C] flex items-center justify-center overflow-hidden bg-[#4DBDCC] p-2">
          <img 
            src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
            alt="Security Camera"
            className="w-10 h-10 lg:w-14 lg:h-14"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <span className="text-xl lg:text-2xl font-bold leading-none">NCPS</span>
          <span className="text-[10px] lg:text-xs font-medium text-blue-200 uppercase tracking-wider">Customer</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 mt-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 font-medium shadow-sm'
                  : 'hover:bg-white/10 hover:translate-x-1'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#4DBDCC]" : "text-gray-300"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
}
