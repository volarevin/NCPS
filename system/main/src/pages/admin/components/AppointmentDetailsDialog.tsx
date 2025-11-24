import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, MapPin, Wrench, Star, AlertCircle, MessageSquare } from "lucide-react";

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "upcoming" | "completed" | "cancelled" | "in-progress" | "confirmed" | "rejected";
  phone: string;
  email: string;
  address: string;
  notes: string;
  technician?: string;
  rating?: number;
  feedback?: string;
  cancellationReason?: string;
  cancellationCategory?: string;
  rejectionReason?: string;
  cancelledByRole?: string;
  cancelledById?: string;
}

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onUpdateStatus?: (id: string, status: Appointment["status"]) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: () => void;
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onUpdateStatus,
  onApprove,
  onReject,
  onCancel,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "upcoming":
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
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

          {/* Completed Appointment Details */}
          {appointment.status === 'completed' && (appointment.rating || appointment.feedback) && (
            <>
              <div className="border-t border-gray-100" />
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#0B4F6C]" />
                  Feedback & Rating
                </h3>
                <div className="pl-6 space-y-3">
                  {appointment.rating && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= appointment.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {appointment.feedback && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Customer Feedback</p>
                      <div className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <p className="text-gray-700 italic text-sm">"{appointment.feedback}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Cancelled/Rejected Details */}
          {(appointment.status === 'cancelled' || appointment.status === 'rejected') && (
            <>
              <div className="border-t border-gray-100" />
              <div className="space-y-4">
                <h3 className="font-semibold text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {appointment.status === 'cancelled' ? 'Cancellation' : 'Rejection'} Details
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Category</p>
                    <Badge variant="outline" className="mt-1 border-red-200 text-red-700 bg-red-50">
                      {appointment.cancellationCategory || 'N/A'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium text-gray-700 bg-red-50 p-3 rounded-lg mt-1 border border-red-100">
                      {appointment.status === 'cancelled' ? appointment.cancellationReason : appointment.rejectionReason || 'No reason provided'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">
                      {appointment.status === 'cancelled' ? 'Cancelled By' : 'Rejected By'}
                    </p>
                    <p className="font-medium text-gray-700">
                      {appointment.cancelledByRole ? (
                        <span className="capitalize">
                          {appointment.cancelledByRole} 
                          {(appointment.cancelledByRole === 'Admin' || appointment.cancelledByRole === 'Receptionist') && appointment.cancelledById && (
                            <span className="text-gray-400 text-xs ml-2">(ID: {appointment.cancelledById})</span>
                          )}
                        </span>
                      ) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

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
            {(appointment.status === "upcoming" || appointment.status === "confirmed") && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Cancel Appointment
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
