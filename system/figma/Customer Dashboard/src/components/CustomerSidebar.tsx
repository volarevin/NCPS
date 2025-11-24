import { LayoutDashboard, Calendar, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

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
    <div className="w-64 bg-[#0B4F6C] text-white flex flex-col shadow-xl h-screen">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-[#145A75]">
        <div className="w-16 h-16 rounded-full border-2 border-[#0B4F6C] flex items-center justify-center overflow-hidden bg-[#4DBDCC] p-2 shadow-lg transition-transform hover:scale-110 duration-300">
          <img 
            src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
            alt="Security Camera"
            className="w-14 h-14"
          />
        </div>
        <div>
          <span className="text-2xl font-bold">NCPS</span>
          <p className="text-xs text-[#B5D9D9]">Customer Portal</p>
        </div>
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
                  ? 'bg-[#145A75] text-white shadow-lg scale-105'
                  : 'text-[#B5D9D9] hover:bg-[#145A75]/50 hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#145A75]">
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