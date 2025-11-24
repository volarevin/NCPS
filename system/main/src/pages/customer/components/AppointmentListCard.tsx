import { Calendar, Clock, User, Eye, X, Star, Edit } from 'lucide-react';
import { Button } from "../../../components/ui/button";

interface AppointmentListCardProps {
  appointment: {
    id: string;
    service: string;
    description: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    technician: string;
  };
  onView: (appointment: any) => void;
  onCancel: (appointment: any) => void;
  onRate: (appointment: any) => void;
  onEdit?: (appointment: any) => void;
}

export function AppointmentListCard({ appointment, onView, onCancel, onRate, onEdit }: AppointmentListCardProps) {
  const statusColors = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-600' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-500' },
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const colors = statusColors[appointment.status];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-3 md:p-6 hover:shadow-md transition-all duration-200 border-l-4 ${colors.bg.replace('100', '300')}`}>
      <div className="flex items-start justify-between mb-2 md:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1.5 md:mb-2 gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-[#1A5560] mb-0.5 md:mb-1 text-sm md:text-lg">{appointment.service}</h3>
              <p className="text-xs md:text-sm text-[#1A5560]/60">{appointment.description}</p>
            </div>
            <span className={`${colors.badge} text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-sm whitespace-nowrap self-start`}>
              {statusLabels[appointment.status]}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-1.5 sm:gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs md:text-sm text-[#1A5560]/70">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center gap-1 text-xs md:text-sm text-[#1A5560]/70">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-1 text-xs md:text-sm text-[#1A5560]/70">
              <User className="w-3 h-3 md:w-4 md:h-4" />
              <span className="truncate">{appointment.technician}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2 md:pt-4 border-t border-gray-200">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(appointment)}
          className="border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10 transition-colors duration-200 w-full sm:w-auto h-8 text-xs md:text-sm"
        >
          <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          View
        </Button>
        
        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit && onEdit(appointment)}
              className="border-[#3FA9BC] text-[#3FA9BC] hover:bg-[#3FA9BC]/10 transition-colors duration-200 w-full sm:w-auto h-8 text-xs md:text-sm"
            >
              <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancel(appointment)}
              className="border-red-500 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full sm:w-auto h-8 text-xs md:text-sm"
            >
              <X className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Cancel
            </Button>
          </>
        )}

        {appointment.status === 'completed' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRate(appointment)}
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 transition-colors duration-200 w-full sm:w-auto h-8 text-xs md:text-sm"
          >
            <Star className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            Rate
          </Button>
        )}
      </div>
    </div>
  );
}
