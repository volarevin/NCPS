import { X, Phone, Mail, MapPin, Calendar, Clock, Wrench, User, CheckCircle, PlayCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface Appointment {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  address: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  notes: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdateStatus: (appointmentId: string, newStatus: "Pending" | "In Progress" | "Completed" | "Cancelled") => void;
  isTechnician?: boolean;
}

export default function AppointmentDetailsModal({ 
  appointment, 
  onClose, 
  onUpdateStatus,
  isTechnician = false 
}: AppointmentDetailsModalProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-xs lg:text-sm">{status}</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-xs lg:text-sm">{status}</Badge>;
      case "Completed":
        return <Badge className="bg-green-500 hover:bg-green-600 text-xs lg:text-sm">{status}</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600 text-xs lg:text-sm">{status}</Badge>;
      default:
        return <Badge className="text-xs lg:text-sm">{status}</Badge>;
    }
  };

  const handleStatusUpdate = (newStatus: "Pending" | "In Progress" | "Completed" | "Cancelled") => {
    onUpdateStatus(appointment.id, newStatus);
  };

  const handleCancelAppointment = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelAppointment = () => {
    handleStatusUpdate("Cancelled");
    setShowCancelDialog(false);
    setCancelReason("");
    alert(`Appointment cancelled${cancelReason ? ` with reason: ${cancelReason}` : ''}`);
    onClose();
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#0B4F6C] text-white p-4 lg:p-6 rounded-t-xl flex items-center justify-between z-10">
            <h2 className="text-xl lg:text-2xl">Appointment Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            {/* Client Information */}
            <div className="bg-[#E8F5F4] rounded-lg p-4 lg:p-5 border-l-4 border-[#0B4F6C]">
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-[#0B4F6C]" />
                <h3 className="text-base lg:text-lg text-[#0B4F6C] font-semibold">Client Information</h3>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <div>
                  <label className="text-xs lg:text-sm text-gray-600 font-medium">Customer Name</label>
                  <p className="text-sm lg:text-base text-gray-900 font-semibold">{appointment.customerName}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs lg:text-sm text-gray-600 font-medium flex items-center gap-1.5 mb-1">
                      <Phone className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C]" />
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm lg:text-base text-gray-900 break-all flex-1">{appointment.phone}</p>
                      <Button
                        onClick={() => handleCall(appointment.phone)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white h-7 lg:h-8 px-2 lg:px-3"
                      >
                        <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs lg:text-sm text-gray-600 font-medium flex items-center gap-1.5 mb-1">
                      <Mail className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C]" />
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm lg:text-base text-gray-900 break-all flex-1">{appointment.email}</p>
                      <Button
                        onClick={() => handleEmail(appointment.email)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white h-7 lg:h-8 px-2 lg:px-3"
                      >
                        <Mail className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs lg:text-sm text-gray-600 font-medium flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C]" />
                    Address
                  </label>
                  <p className="text-sm lg:text-base text-gray-900">{appointment.address}</p>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-[#E8F5F4] rounded-lg p-4 lg:p-5 border-l-4 border-[#4DBDCC]">
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <Wrench className="w-4 h-4 lg:w-5 lg:h-5 text-[#0B4F6C]" />
                <h3 className="text-base lg:text-lg text-[#0B4F6C] font-semibold">Service Details</h3>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs lg:text-sm text-gray-600 font-medium">Service Type</label>
                    <p className="text-sm lg:text-base text-gray-900 font-semibold">{appointment.service}</p>
                  </div>
                  <div>
                    <label className="text-xs lg:text-sm text-gray-600 font-medium">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs lg:text-sm text-gray-600 font-medium flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C]" />
                      Appointment Date
                    </label>
                    <p className="text-sm lg:text-base text-gray-900">{appointment.date}</p>
                  </div>
                  <div>
                    <label className="text-xs lg:text-sm text-gray-600 font-medium flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C]" />
                      Appointment Time
                    </label>
                    <p className="text-sm lg:text-base text-gray-900">{appointment.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="bg-yellow-50 rounded-lg p-4 lg:p-5 border-l-4 border-yellow-400">
                <h3 className="text-base lg:text-lg text-gray-900 mb-2 font-semibold">Special Notes</h3>
                <p className="text-sm lg:text-base text-gray-700">{appointment.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            {isTechnician && appointment.status !== "Completed" && appointment.status !== "Cancelled" && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                {appointment.status === "Pending" && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate("In Progress");
                      alert("Appointment status updated to In Progress");
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 transition-transform"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Working
                  </Button>
                )}
                {appointment.status === "In Progress" && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate("Completed");
                      alert("Appointment marked as Completed!");
                      onClose();
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white hover:scale-105 transition-transform"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                <Button
                  onClick={handleCancelAppointment}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:scale-105 transition-transform"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Appointment
                </Button>
              </div>
            )}

            {/* Show status if completed or cancelled */}
            {(appointment.status === "Completed" || appointment.status === "Cancelled") && (
              <div className={`rounded-lg p-4 ${appointment.status === "Completed" ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"}`}>
                <p className="text-sm lg:text-base text-gray-700">
                  <span className="font-semibold">This appointment has been {appointment.status.toLowerCase()}.</span>
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full sm:w-auto border-[#0B4F6C] text-[#0B4F6C] hover:bg-[#E8F5F4] hover:scale-105 transition-transform"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                Cancel Appointment
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this appointment? You can optionally provide a reason below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">
                  Cancellation Reason (Optional)
                </label>
                <Textarea
                  placeholder="Enter reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancelReason("");
                }}
                className="w-full sm:w-auto"
              >
                Go Back
              </Button>
              <Button
                variant="destructive"
                onClick={confirmCancelAppointment}
                className="w-full sm:w-auto"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}