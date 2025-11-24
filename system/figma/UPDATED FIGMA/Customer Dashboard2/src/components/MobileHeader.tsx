import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0B4F6C] text-white h-16 flex items-center px-4 shadow-lg z-30 md:hidden">
      <button 
        onClick={onMenuClick}
        className="p-2 hover:bg-[#145A75] rounded-lg transition-colors duration-200"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="flex items-center gap-3 ml-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#0B4F6C] flex items-center justify-center overflow-hidden bg-[#4DBDCC] p-1.5 shadow-lg">
          <img 
            src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
            alt="Security Camera"
            className="w-8 h-8"
          />
        </div>
        <span className="text-xl font-bold">NCPS</span>
      </div>
    </header>
  );
}
