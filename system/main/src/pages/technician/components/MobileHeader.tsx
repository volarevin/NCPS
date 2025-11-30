import { useState, useEffect } from 'react';
import { Menu, User } from 'lucide-react';
import { getProfilePictureUrl } from "@/lib/utils";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') || '{}'));

  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
      setUser(updatedUser);
    };

    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileUpdate);
    };
  }, []);

  return (
    <div className="lg:hidden bg-[#0B4F6C] text-white px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
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
            <span className="text-[10px] font-medium text-blue-200 uppercase tracking-wider">Technician</span>
          </div>
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
        {user.profile_picture ? (
          <img src={getProfilePictureUrl(user.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-gray-300" />
        )}
      </div>
    </div>
  );
}
