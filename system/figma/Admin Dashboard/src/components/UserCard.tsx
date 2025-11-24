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
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-md"
            style={{ backgroundColor: roleColors[role] }}
          >
            {fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base text-gray-800 group-hover:text-[#0B4F6C] transition-colors truncate">
            {fullName}
          </h3>
          <p className="text-xs md:text-sm text-gray-500">@{username}</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-3">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs"
          style={{ backgroundColor: roleColors[role] }}
        >
          <RoleIcon className="w-3 h-3" />
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
          <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
          <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
          <span>{phone}</span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mt-3 text-right">
        Click for details →
      </div>
    </div>
  );
}