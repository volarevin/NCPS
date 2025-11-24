import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Calendar, Clock, User, Phone, Mail, MapPin, Wrench } from "lucide-react";

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "upcoming" | "completed" | "cancelled" | "in-progress";
  phone: string;
  email: string;
  address: string;
  notes: string;
  technician?: string;
}

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onUpdateStatus?: (id: string, status: Appointment["status"]) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onUpdateStatus,
  onApprove,
  onReject,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-500";
      case "upcoming":
        return "bg-blue-500";
      case "in-progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#B8D8D8] border-2 md:border-4 border-[#0B4F6C] rounded-2xl p-0">
        <div className="p-4 md:p-8">
          <DialogHeader>
            <div className="flex items-start md:items-center justify-between gap-2 md:gap-4">
              <DialogTitle className="text-xl md:text-2xl text-[#0B4F6C]">
                Appointment Details
              </DialogTitle>
              <Badge
                className={`${getStatusColor(appointment.status)} text-white border-none px-2 md:px-3 py-1 text-xs md:text-sm whitespace-nowrap`}
              >
                {getStatusText(appointment.status)}
              </Badge>
            </div>
          </DialogHeader>

        <div className="space-y-4 md:space-y-6 mt-4">
          {/* Client Information */}
          <div className="bg-white/50 rounded-xl p-3 md:p-4 space-y-2 md:space-y-3 border-2 border-gray-300">
            <h3 className="text-base md:text-lg text-[#0B4F6C] font-semibold mb-3">Client Information</h3>
            
            <div className="flex items-start gap-3 text-gray-700">
              <User className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-500">Name</div>
                <div className="text-sm md:text-base break-words">{appointment.clientName}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-500">Phone</div>
                <div className="text-sm md:text-base break-words">{appointment.phone}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-500">Email</div>
                <div className="text-sm md:text-base break-words">{appointment.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-500">Address</div>
                <div className="text-sm md:text-base break-words">{appointment.address}</div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white/50 rounded-xl p-3 md:p-4 space-y-2 md:space-y-3 border-2 border-gray-300">
            <h3 className="text-base md:text-lg text-[#0B4F6C] font-semibold mb-3">Service Details</h3>
            
            <div className="flex items-start gap-3 text-gray-700">
              <Wrench className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-500">Service</div>
                <div className="text-sm md:text-base break-words">{appointment.service}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-500">Date</div>
                <div className="text-sm md:text-base">{appointment.date}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C] mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-500">Time</div>
                <div className="text-sm md:text-base">{appointment.time}</div>
              </div>
            </div>

            {appointment.technician && (
              <div className="flex items-start gap-3 text-gray-700">
                <User className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C] mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm text-gray-500">Assigned Technician</div>
                  <div className="text-sm md:text-base break-words">{appointment.technician}</div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="bg-white/50 rounded-xl p-3 md:p-4 border-2 border-gray-300">
              <h3 className="text-base md:text-lg text-[#0B4F6C] font-semibold mb-2">Notes</h3>
              <p className="text-sm md:text-base text-gray-700">{appointment.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 justify-end pt-4">
            {appointment.status === "pending" && onApprove && onReject && (
              <>
                <button
                  onClick={() => {
                    onApprove(appointment.id);
                    onOpenChange(false);
                  }}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-[#28A745] hover:bg-[#218838] text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    onReject(appointment.id);
                    onOpenChange(false);
                  }}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-[#DC3545] hover:bg-[#C82333] text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  Reject
                </button>
              </>
            )}
            {appointment.status === "upcoming" && onUpdateStatus && (
              <>
                <button
                  onClick={() => {
                    onUpdateStatus(appointment.id, "in-progress");
                    onOpenChange(false);
                  }}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-[#FFA500] hover:bg-[#FF8C00] text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  Start Service
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(appointment.id, "cancelled");
                    onOpenChange(false);
                  }}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-[#DC3545] hover:bg-[#C82333] text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
              </>
            )}
            {appointment.status === "in-progress" && onUpdateStatus && (
              <button
                onClick={() => {
                  onUpdateStatus(appointment.id, "completed");
                  onOpenChange(false);
                }}
                className="px-4 md:px-6 py-2 md:py-2.5 bg-[#28A745] hover:bg-[#218838] text-white rounded-lg transition-colors text-sm md:text-base"
              >
                Mark as Completed
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 md:px-6 py-2 md:py-2.5 bg-[#0B4F6C] hover:bg-[#084058] text-white rounded-lg transition-colors text-sm md:text-base"
            >
              Close
            </button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}