import { X, Phone, Mail, MapPin, Calendar, Clock, Wrench, User, CheckCircle, PlayCircle, XCircle, Star, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useState } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface Appointment {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  address: string;
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  notes: string;
  rating?: number;
  feedback?: string;
  cancellationReason?: string;
  cancellationCategory?: string;
  rejectionReason?: string;
  cancelledByRole?: string;
  cancelledById?: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdateStatus: (appointmentId: string, newStatus: "Pending" | "In Progress" | "Completed" | "Cancelled", reason?: string, category?: string) => void;
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
  const [cancelCategory, setCancelCategory] = useState("");

  const cancellationCategories = [
    "No available technician",
    "Scheduling conflict",
    "Equipment failure",
    "Emergency",
    "Customer Request",
    "Other"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleStatusUpdate = (newStatus: "Pending" | "In Progress" | "Completed" | "Cancelled", reason?: string, category?: string) => {
    onUpdateStatus(appointment.id, newStatus, reason, category);
  };

  const handleCancelAppointment = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelAppointment = () => {
    if (!cancelCategory) {
        alert("Please select a cancellation category");
        return;
    }
    handleStatusUpdate("Cancelled", cancelReason, cancelCategory);
    setShowCancelDialog(false);
    setCancelReason("");
    setCancelCategory("");
    alert(`Appointment cancelled${cancelReason ? ` with reason: ${cancelReason}` : ''}`);
    onClose();
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <DialogTitle className="text-xl font-bold text-[#0B4F6C]">
                Appointment Details
              </DialogTitle>
              <Badge className={`${getStatusColor(appointment.status)} text-xs lg:text-sm`}>
                {appointment.status}
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
                  <p className="font-medium">{appointment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <p className="font-medium">{appointment.phone}</p>
                    <Button
                        onClick={() => handleCall(appointment.phone)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-green-600"
                      >
                        <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <p className="font-medium">{appointment.email}</p>
                    <Button
                        onClick={() => handleEmail(appointment.email)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-blue-600"
                      >
                        <Mail className="w-3 h-3" />
                    </Button>
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
                
                {appointment.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium text-gray-700 bg-yellow-50 p-3 rounded-lg mt-1 border border-yellow-100">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Appointment Details */}
            {appointment.status === 'Completed' && (appointment.rating || appointment.feedback) && (
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

            {/* Cancelled Details */}
            {appointment.status === 'Cancelled' && (
              <>
                <div className="border-t border-gray-100" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Cancellation Details
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
                        {appointment.cancellationReason || 'No reason provided'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Cancelled By</p>
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
              {isTechnician && appointment.status !== "Completed" && appointment.status !== "Cancelled" && (
                <>
                  {(appointment.status === "Pending" || appointment.status === "Confirmed") && isToday(appointment.date) && (
                    <Button
                      onClick={() => {
                        handleStatusUpdate("In Progress");
                        alert("Appointment status updated to In Progress");
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
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
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                  <Button
                    onClick={handleCancelAppointment}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Appointment
                  </Button>
                </>
              )}
              
              {(appointment.status === "Completed" || appointment.status === "Cancelled") && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                  Cancellation Category <span className="text-red-500">*</span>
                </label>
                <Select value={cancelCategory} onValueChange={setCancelCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {cancellationCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  setCancelCategory("");
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
