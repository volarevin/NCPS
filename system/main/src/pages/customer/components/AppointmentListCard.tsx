import { Calendar, Clock, User, Eye, X, Star, Edit } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

interface AppointmentListCardProps {
  appointment: {
    id: string;
    service: string;
    description: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    technician: string;
    technicianPhone?: string;
    technicianEmail?: string;
    address?: string;
    notes?: string;
    rating?: number;
    feedback?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  onView: (appointment: any) => void;
  onCancel: (appointment: any) => void;
  onRate: (appointment: any) => void;
  onEdit?: (appointment: any) => void;
}

export function AppointmentListCard({ appointment, onView, onCancel, onRate, onEdit }: AppointmentListCardProps) {
  const statusColors = {
    pending: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    in_progress: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
    completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-700 hover:bg-green-200' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-700 hover:bg-red-200' },
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const colors = statusColors[appointment.status] || statusColors.pending;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group`}>
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${colors.badge} border-0 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide`}>
                {statusLabels[appointment.status]}
              </Badge>
              <span className="text-xs text-gray-400 font-medium">#{appointment.id}</span>
            </div>
            <h3 className="text-lg font-bold text-[#1A5560] mb-1 group-hover:text-[#3FA9BC] transition-colors">
              {appointment.service}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {appointment.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3FA9BC]" />
              <span className="font-medium">{appointment.date}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300 self-center"></div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#3FA9BC]" />
              <span className="font-medium">{appointment.time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <User className="w-4 h-4 text-gray-400" />
          <span>Technician: <span className="font-medium text-gray-700">{appointment.technician}</span></span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(appointment)}
            className="text-gray-600 hover:text-[#1A5560] hover:bg-gray-50 border-gray-200"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            View Details
          </Button>

          {appointment.status === 'pending' && onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(appointment)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
            >
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          )}

          {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onCancel(appointment)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 ml-auto"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Cancel
            </Button>
          )}

          {appointment.status === 'completed' && !appointment.rating && (
            <Button 
              size="sm" 
              onClick={() => onRate(appointment)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white ml-auto shadow-sm"
            >
              <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
              Rate Service
            </Button>
          )}
          
          {appointment.status === 'completed' && appointment.rating && (
            <div className="ml-auto flex items-center gap-1 text-yellow-500 font-medium text-sm bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{appointment.rating}/5</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-col items-end text-[10px] text-gray-400 gap-0.5">
          {appointment.createdAt && (
            <span>Date Added: {appointment.createdAt.toLocaleDateString()} {appointment.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          )}
          {appointment.updatedAt && (
            <span>Last Updated: {appointment.updatedAt.toLocaleDateString()} {appointment.updatedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          )}
        </div>
      </div>
    </div>
  );
}
