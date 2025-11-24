import { LayoutDashboard, Calendar, User, LogOut, X } from 'lucide-react';
import { Button } from './ui/button';

type Page = 'dashboard' | 'appointments' | 'profile';

interface MobileSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onClose: () => void;
}

export function MobileSidebar({ currentPage, onNavigate, onClose }: MobileSidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments' as Page, label: 'Appointments', icon: Calendar },
    { id: 'profile' as Page, label: 'User Account', icon: User },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-[#0B4F6C] text-white shadow-2xl z-50 md:hidden animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#145A75]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#0B4F6C] flex items-center justify-center overflow-hidden bg-[#4DBDCC] p-2 shadow-lg">
            <img 
              src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
              alt="Security Camera"
              className="w-10 h-10"
            />
          </div>
          <div>
            <span className="text-xl font-bold">NCPS</span>
            <p className="text-xs text-[#B5D9D9]">Customer</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#145A75] rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-[#145A75] text-white shadow-lg'
                  : 'text-[#B5D9D9] hover:bg-[#145A75]/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#145A75] absolute bottom-0 left-0 right-0">
        <Button
          onClick={handleLogout}
          variant="secondary"
          className="w-full bg-[#B5D9D9] text-[#0B4F6C] hover:bg-white hover:shadow-lg transition-all duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
