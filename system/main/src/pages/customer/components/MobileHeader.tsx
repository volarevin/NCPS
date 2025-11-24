import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden bg-[#0B4F6C] text-white px-4 py-3 flex items-center gap-3 shadow-lg">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-[#145A75] rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full border-2 border-[#4DBDCC] flex items-center justify-center bg-[#4DBDCC] p-1.5 shadow-md">
          <img 
            src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
            alt="NCPS Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-none">NCPS</span>
          <span className="text-[10px] font-medium text-blue-200 uppercase tracking-wider">Customer</span>
        </div>
      </div>
    </div>
  );
}
