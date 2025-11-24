import { Calendar, LogOut, LayoutDashboard, User, X } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'account', label: 'User Account', icon: User },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0B4F6C] text-white flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header with Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#4DBDCC] shadow-lg">
            <img 
              src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
              alt="NCPS Logo"
              className="w-8 h-8"
            />
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg">NCPS</div>
            <div className="text-xs text-[#B5D9D9]">Receptionist Portal</div>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-white hover:bg-[#145A75] p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-[#145A75] text-white'
                    : 'text-[#B5D9D9] hover:bg-[#145A75]/30 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full bg-transparent border-[#B5D9D9] text-[#B5D9D9] hover:bg-[#B5D9D9] hover:text-[#0B4F6C] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Log Out</span>
          </Button>
        </div>
      </div>
    </>
  );
}
