import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, MapPin, Wrench, Star, AlertCircle, MessageSquare } from "lucide-react";

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  technician?: string;
  technician_id?: number;
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
  onStatusUpdate: (id: string, status: string, technicianId?: string) => void;
  onUpdateDetails?: (id: string, date: string, time: string, technicianId: string) => Promise<void>;
  onCancel?: () => void;
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onStatusUpdate,
  onUpdateDetails,
  onCancel
}: AppointmentDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [technicians, setTechnicians] = useState<any[]>([]);

  useEffect(() => {
    if (appointment) {
      // Parse date properly
      const dateObj = new Date(appointment.date);
      if (!isNaN(dateObj.getTime())) {
          setEditDate(dateObj.toISOString().split('T')[0]);
      }

      // Parse time properly (convert 12h to 24h for input)
      if (appointment.time) {
          const [timeStr, modifier] = appointment.time.split(' ');
          let [hours, minutes] = timeStr.split(':');
          if (hours === '12') {
              hours = '00';
          }
          if (modifier === 'PM') {
              hours = (parseInt(hours, 10) + 12).toString();
          }
          setEditTime(`${hours.padStart(2, '0')}:${minutes}`);
      }

      setSelectedTechnician(appointment.technician_id?.toString() || "");
      setIsEditing(false);
    }
  }, [appointment]);

  useEffect(() => {
    if (open) {
      fetchTechnicians();
    }
  }, [open]);

  const fetchTechnicians = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/receptionist/technicians', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTechnicians(data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (onUpdateDetails && appointment) {
      await onUpdateDetails(appointment.id, editDate, editTime, selectedTechnician);
      setIsEditing(false);
    }
  };

  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "upcoming":
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
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
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{appointment.service}</p>
              </div>
              
              {/* Technician Selection Logic */}
              <div>
                <p className="text-sm text-gray-500">Technician</p>
                {isEditing || appointment.status === 'pending' ? (
                  <Select 
                    value={selectedTechnician} 
                    onValueChange={setSelectedTechnician}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Assign Technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.user_id} value={tech.user_id.toString()}>
                          {tech.first_name} {tech.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium text-[#0B4F6C]">
                    {appointment.technician || "Not Assigned"}
                  </p>
                )}
              </div>

              {/* Date & Time Logic */}
              <div>
                <p className="text-sm text-gray-500">Date</p>
                {isEditing ? (
                  <Input 
                    type="date" 
                    value={editDate} 
                    onChange={(e) => setEditDate(e.target.value)}
                    className="h-8 mt-1"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <p className="font-medium">{appointment.date}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                {isEditing ? (
                  <Input 
                    type="time" 
                    value={editTime} 
                    onChange={(e) => setEditTime(e.target.value)}
                    className="h-8 mt-1"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                )}
              </div>
              
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                  {appointment.notes}
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation/Rejection Info */}
          {(appointment.status === 'cancelled' || appointment.status === 'rejected') && (
            <>
              <div className="border-t border-gray-100" />
              <div className="space-y-4">
                <h3 className="font-semibold text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {appointment.status === 'cancelled' ? 'Cancellation Details' : 'Rejection Details'}
                </h3>
                <div className="pl-6 space-y-3 bg-red-50 p-4 rounded-lg">
                  {appointment.cancellationCategory && (
                    <div>
                      <p className="text-sm text-red-500 mb-1">Reason Category</p>
                      <p className="font-medium text-gray-800">{appointment.cancellationCategory}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-red-500 mb-1">
                      {appointment.status === 'cancelled' ? 'Cancellation Reason' : 'Rejection Reason'}
                    </p>
                    <p className="font-medium text-gray-800">
                      {appointment.cancellationReason || appointment.rejectionReason || "No reason provided"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

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
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel Edit
              </Button>
              <Button 
                className="bg-[#0B4F6C] hover:bg-[#012A4A]"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              {appointment.status === 'pending' && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => onCancel?.()}
                  >
                    Reject
                  </Button>
                  <Button 
                    className="bg-[#0B4F6C] hover:bg-[#012A4A]"
                    onClick={() => onStatusUpdate(appointment.id, 'confirmed', selectedTechnician)}
                    disabled={!selectedTechnician}
                  >
                    Approve
                  </Button>
                </>
              )}

              {(appointment.status === 'confirmed' || appointment.status === 'upcoming') && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => onCancel?.()}
                  >
                    Cancel Appointment
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Details
                  </Button>
                </>
              )}

              {appointment.status === 'in-progress' && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onStatusUpdate(appointment.id, 'completed')}
                >
                  Mark as Completed
                </Button>
              )}
              
              {(appointment.status === 'completed' || appointment.status === 'cancelled' || appointment.status === 'rejected') && (
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
