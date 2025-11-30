import { Bell, CheckCircle2, XCircle, AlertCircle, CheckCheck, Calendar } from 'lucide-react';

interface NotificationCardProps {
  notification: {
    title: string;
    message: string;
    created_at: string;
    is_read: number;
    service_name?: string;
  };
  onClick?: () => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const getIcon = () => {
    const title = notification.title || '';
    if (title.includes('Approved')) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (title.includes('Rejected')) return <XCircle className="w-5 h-5 text-red-500" />;
    if (title.includes('Cancelled')) return <AlertCircle className="w-5 h-5 text-orange-500" />;
    if (title.includes('Completed')) return <CheckCheck className="w-5 h-5 text-blue-500" />;
    return <Bell className="w-5 h-5 text-[#4DBDCC]" />;
  };

  return (
    <div 
      onClick={onClick}
      className={`border-l-4 border-l-[#4DBDCC] bg-white p-4 rounded-r-lg shadow-sm hover:shadow-md transition-all cursor-pointer mb-3 border border-gray-100`}
    >
      <div className="flex gap-3">
        <div className="mt-1 flex-shrink-0">
            {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-[#0B4F6C] text-sm md:text-base truncate pr-2">{notification.title}</h4>
                <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                    {new Date(notification.created_at).toLocaleDateString()}
                </span>
            </div>
            
            {notification.service_name && (
                <p className="text-xs font-medium text-gray-700 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {notification.service_name}
                </p>
            )}
            
            <p className="text-gray-600 text-xs md:text-sm mt-1 line-clamp-2">{notification.message}</p>
        </div>
      </div>
    </div>
  );
}
