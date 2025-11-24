import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  iconColor: string;
}

export function StatCard({ icon: Icon, label, value, color, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-transparent hover:border-[#3FA9BC]/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#1A5560]/60 text-[10px] md:text-sm mb-1">{label}</p>
          <p className="text-[#1A5560] text-xl md:text-3xl font-semibold">{value}</p>
        </div>
        <div className={`${color} rounded-lg p-1.5 md:p-3 flex-shrink-0`}>
          <Icon className={`w-4 h-4 md:w-6 md:h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
