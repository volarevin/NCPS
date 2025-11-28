import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, MapPin, Wrench, Star, AlertCircle, MessageSquare, Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  technicianId?: string; // Added for pre-selection
  rating?: number;
  feedback?: string;
  cancellationReason?: string;
  cancellationCategory?: string;
  rejectionReason?: string;
  cancelledByRole?: string;
  cancelledById?: string;
}

interface Technician {
  user_id: number;
  first_name: string;
  last_name: string;
}

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onUpdateStatus?: (id: string, status: Appointment["status"], technicianId?: string) => void;
  onApprove?: (id: string, technicianId: string, technicianName?: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onUpdateDetails?: (id: string, date: string, time: string, technicianId: string) => void;
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onUpdateStatus,
  onApprove,
  onReject,
  onCancel,
  onUpdateDetails
}: AppointmentDetailsDialogProps) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  useEffect(() => {
    if (open) {
      fetchTechnicians();
      if (appointment) {
        // Reset state when dialog opens
        setSelectedTechnician(appointment.technicianId || "");
        
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
        
        setIsEditing(false);
      }
    }
  }, [open, appointment]);

  const fetchTechnicians = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/technicians', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTechnicians(data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  if (!appointment) return null;

  const handleSaveChanges = async () => {
    if (onUpdateDetails && appointment) {
      await onUpdateDetails(appointment.id, editDate, editTime, selectedTechnician);
      setIsEditing(false);
    }
  };

  const handleApproveClick = () => {
    if (onApprove && appointment) {
        const tech = technicians.find(t => t.user_id.toString() === selectedTechnician);
        const techName = tech ? `${tech.first_name} ${tech.last_name}` : undefined;
        onApprove(appointment.id, selectedTechnician, techName);
    }
  };

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
            <div className="flex items-center gap-2">
              {(appointment.status === 'confirmed' || appointment.status === 'upcoming') && !isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              )}
              <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </div>
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
                      onClick={() => onReject?.(appointment.id)}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="bg-[#0B4F6C] hover:bg-[#012A4A]"
                      onClick={handleApproveClick}
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
                      onClick={() => onCancel?.(appointment.id)}
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
                    onClick={() => onUpdateStatus?.(appointment.id, 'completed')}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
