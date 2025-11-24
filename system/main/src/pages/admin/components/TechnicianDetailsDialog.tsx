import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Phone, Mail, Star, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
import { SPECIALTIES } from "./AddTechnicianDialog";

interface Review {
  review_id: number;
  appointment_id: number;
  rating: number;
  feedback_text: string;
  created_at: string;
  customer_first: string;
  customer_last: string;
  service_name?: string;
}

interface ScheduleItem {
  appointment_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service_name: string;
  client_first: string;
  client_last: string;
  client_location: string;
}

export interface TechnicianDetails {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  specialty: string;
  availability_status: string;
  total_jobs_completed: number;
  average_rating: string;
  reviews: Review[];
  schedule?: ScheduleItem[];
}

interface TechnicianDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician: TechnicianDetails | null;
  onViewAppointment: (appointmentId: number) => void;
}

export function TechnicianDetailsDialog({ 
  open, 
  onOpenChange, 
  technician,
  onViewAppointment
}: TechnicianDetailsDialogProps) {
  if (!technician) return null;

  const specialtyConfig = SPECIALTIES.find(s => s.value === technician.specialty) || SPECIALTIES.find(s => s.value === "General")!;
  const SpecialtyIcon = specialtyConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0B4F6C]">Technician Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col gap-6 py-4">
            {/* Header Info */}
            <div className="flex items-start gap-4">
                <div className={`w-20 h-20 rounded-full ${specialtyConfig.bg} flex items-center justify-center border-2 border-gray-200 shrink-0`}>
                    <SpecialtyIcon className={`w-10 h-10 ${specialtyConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-gray-800 truncate">
                        {technician.first_name || "Unknown"} {technician.last_name || "Technician"}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {technician.specialty || "General"}
                        </Badge>
                        <Badge className={(technician.availability_status || 'offline').toLowerCase() === 'available' ? 'bg-green-600' : 'bg-gray-500'}>
                            {technician.availability_status || 'Offline'}
                        </Badge>
                    </div>
                    <div className="flex flex-col gap-1 mt-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" /> 
                            {technician.phone_number || "N/A"}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" /> 
                            <span className="truncate">{technician.email || "N/A"}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 text-yellow-500 font-bold text-lg">
                        <Star className="w-5 h-5 fill-current" />
                        {parseFloat(technician.average_rating || "0").toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-500">{technician.total_jobs_completed || 0} Jobs Completed</p>
                </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                {/* Schedule Section */}
                <div className="flex flex-col min-h-0">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#0B4F6C]" />
                        Upcoming Schedule
                    </h4>
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-3 pr-4 pb-2">
                            {technician.schedule && technician.schedule.length > 0 ? (
                                technician.schedule.map((item, idx) => (
                                    <div 
                                      key={idx} 
                                      className="p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer shadow-sm"
                                      onClick={() => onViewAppointment(item.appointment_id)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-gray-900 text-sm">{item.service_name}</span>
                                            <Badge variant="outline" className="text-xs">{item.status}</Badge>
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.appointment_date).toLocaleDateString()} at {item.appointment_time}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3" />
                                                {item.client_first} {item.client_last}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate">{item.client_location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-sm">
                                    No upcoming appointments
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Reviews Section */}
                <div className="flex flex-col min-h-0">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#0B4F6C]" />
                        Recent Reviews
                    </h4>
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-3 pr-4 pb-2">
                            {technician.reviews && technician.reviews.length > 0 ? (
                                technician.reviews.map((review, idx) => (
                                    <div 
                                      key={idx} 
                                      className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                      onClick={() => onViewAppointment(review.appointment_id)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900 text-sm">{review.customer_first} {review.customer_last}</span>
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                                              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        {review.service_name && (
                                            <div className="mb-2">
                                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">
                                                    {review.service_name}
                                                </Badge>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">"{review.feedback_text}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-sm">
                                    No reviews yet
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
