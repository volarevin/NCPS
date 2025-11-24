import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Calendar, Clock, MapPin, User, Phone, Mail, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface ViewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
  onEdit?: (appointment: any) => void;
  onReschedule?: (appointment: any) => void;
}

export function ViewAppointmentDialog({ open, onOpenChange, appointment, onEdit, onReschedule }: ViewAppointmentDialogProps) {
  if (!appointment) return null;

  const statusColors = {
    pending: 'bg-orange-500',
    confirmed: 'bg-blue-500',
    in_progress: 'bg-blue-600',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(appointment);
    }
    onOpenChange(false);
  };

  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule(appointment);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[#1A5560]">Appointment Details</DialogTitle>
            <span className={`${statusColors[appointment.status]} text-white px-3 py-1 rounded-full text-sm`}>
              {statusLabels[appointment.status]}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Service Information */}
          <div>
            <h3 className="text-[#1A5560] mb-2 text-sm font-semibold">Service Information</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div>
                <p className="text-xs text-[#1A5560]/60">Service Type</p>
                <p className="text-[#1A5560] text-sm">{appointment.service}</p>
              </div>
              <div>
                <p className="text-xs text-[#1A5560]/60">Description</p>
                <p className="text-[#1A5560] text-sm">{appointment.description}</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-[#1A5560] mb-2 text-sm font-semibold">Schedule</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-[#1A5560]">
                <Calendar className="w-4 h-4 text-[#3FA9BC]" />
                <div>
                  <p className="text-xs text-[#1A5560]/60">Date</p>
                  <p className="text-sm">{appointment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#1A5560]">
                <Clock className="w-4 h-4 text-[#3FA9BC]" />
                <div>
                  <p className="text-xs text-[#1A5560]/60">Time</p>
                  <p className="text-sm">{appointment.time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technician Details */}
          {appointment.technician !== 'Pending assignment' && (
            <div>
              <h3 className="text-[#1A5560] mb-2 text-sm font-semibold">Technician Details</h3>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-[#1A5560]">
                  <User className="w-4 h-4 text-[#3FA9BC]" />
                  <div>
                    <p className="text-xs text-[#1A5560]/60">Name</p>
                    <p className="text-sm">{appointment.technician}</p>
                  </div>
                </div>
                {appointment.technicianPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#3FA9BC]" />
                    <div>
                      <p className="text-xs text-[#1A5560]/60">Phone</p>
                      <a
                        href={`tel:${appointment.technicianPhone}`}
                        className="text-[#3FA9BC] hover:text-[#2A6570] transition-colors duration-200 text-sm"
                      >
                        {appointment.technicianPhone}
                      </a>
                    </div>
                  </div>
                )}
                {appointment.technicianEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#3FA9BC]" />
                    <div>
                      <p className="text-xs text-[#1A5560]/60">Email</p>
                      <a
                        href={`mailto:${appointment.technicianEmail}`}
                        className="text-[#3FA9BC] hover:text-[#2A6570] transition-colors duration-200 text-sm break-all"
                      >
                        {appointment.technicianEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <h3 className="text-[#1A5560] mb-2 text-sm font-semibold">Service Location</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start gap-2 text-[#1A5560]">
                <MapPin className="w-4 h-4 text-[#3FA9BC] mt-0.5" />
                <div>
                  <p className="text-xs text-[#1A5560]/60">Address</p>
                  <p className="text-sm">{appointment.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h3 className="text-[#1A5560] mb-2 text-sm font-semibold">Additional Notes</h3>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-[#3FA9BC] mt-0.5" />
                  <p className="text-[#1A5560] text-sm">{appointment.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10 h-9 text-sm"
          >
            Close
          </Button>
          {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
            <>
              <Button 
                onClick={handleEdit}
                variant="outline"
                className="flex-1 border-[#3FA9BC] text-[#3FA9BC] hover:bg-[#3FA9BC]/10 h-9 text-sm"
              >
                Edit
              </Button>
              <Button 
                onClick={handleReschedule}
                className="flex-1 bg-[#3FA9BC] hover:bg-[#2A6570] transition-colors duration-200 h-9 text-sm"
              >
                Reschedule
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}