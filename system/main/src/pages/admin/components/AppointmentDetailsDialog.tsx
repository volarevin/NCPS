import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-xl font-bold text-[#0B4F6C]">
              Appointment Details
            </DialogTitle>
            <Badge className={`${getStatusColor(appointment.status)} text-white`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Client Info Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0B4F6C]" />
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{appointment.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <p className="font-medium">{appointment.phone}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <p className="font-medium">{appointment.email}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <p className="font-medium">{appointment.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Service Info Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#0B4F6C]" />
              Service Details
            </h3>
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="font-medium">{appointment.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Technician</p>
                <p className="font-medium text-[#0B4F6C]">
                  {appointment.technician || "Not Assigned"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <p className="font-medium">{appointment.date}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <p className="font-medium">{appointment.time}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                  {appointment.notes}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            {appointment.status === "pending" && (
              <>
                <button
                  onClick={() => onReject?.(appointment.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => onApprove?.(appointment.id)}
                  className="px-4 py-2 bg-[#0B4F6C] text-white rounded-lg hover:bg-[#093e54] transition-colors font-medium"
                >
                  Approve Request
                </button>
              </>
            )}
            {appointment.status === "upcoming" && (
              <button
                onClick={() => onUpdateStatus?.(appointment.id, "in-progress")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Service
              </button>
            )}
            {appointment.status === "in-progress" && (
              <button
                onClick={() => onUpdateStatus?.(appointment.id, "completed")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
