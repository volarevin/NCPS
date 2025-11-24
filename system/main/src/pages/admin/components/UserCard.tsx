import { User, Mail, Phone, Shield, Users, Wrench } from "lucide-react";

interface UserCardProps {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: "customer" | "staff" | "technician";
  avatar?: string;
  onClick: () => void;
}

export function UserCard({
  fullName,
  username,
  email,
  phone,
  role,
  avatar,
  onClick,
}: UserCardProps) {
  const roleColors = {
    customer: "#5B8FFF",
    staff: "#7B9B7C",
    technician: "#FF9B66",
  };

  const roleIcons = {
    customer: Users,
    staff: Shield,
    technician: Wrench,
  };

  const RoleIcon = roleIcons[role];

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#0B4F6C] transform hover:-translate-y-1"
    >
      {/* Header with Avatar and Role Badge */}
      <div className="flex items-center gap-3 mb-4">
        {avatar ? (
          <img
            src={avatar}
            alt={fullName}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-[#0B4F6C] transition-colors"
          />
        ) : (
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 group-hover:border-[#0B4F6C] transition-colors">
            <User className="w-6 h-6 md:w-7 md:h-7 text-gray-400 group-hover:text-[#0B4F6C]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 truncate group-hover:text-[#0B4F6C] transition-colors">
            {fullName}
          </h3>
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1"
            style={{
              backgroundColor: `${roleColors[role]}20`,
              color: roleColors[role],
            }}
          >
            <RoleIcon className="w-3 h-3" />
            <span className="capitalize">{role}</span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 group-hover:bg-[#E6F0F4] transition-colors">
          <Mail className="w-4 h-4 text-gray-400 group-hover:text-[#0B4F6C]" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 group-hover:bg-[#E6F0F4] transition-colors">
          <Phone className="w-4 h-4 text-gray-400 group-hover:text-[#0B4F6C]" />
          <span className="truncate">{phone}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">@{username}</span>
        <span className="text-xs font-medium text-[#0B4F6C] opacity-0 group-hover:opacity-100 transition-opacity">
          View Details →
        </span>
      </div>
    </div>
  );
}
