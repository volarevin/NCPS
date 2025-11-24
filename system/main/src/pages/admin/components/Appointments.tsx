import { PageHeader } from "./PageHeader";
import { useState, useEffect } from "react";
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog";
import { RecycleBinDialog } from "./RecycleBinDialog";
import { CreateAppointmentDialog } from "./CreateAppointmentDialog";
import { StatusChangeDialog } from "./StatusChangeDialog";
import {
  Calendar,
  Clock,
  User,
  Search,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Loader,
  Trash2,
  Phone
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  rawDate: Date;
  rating?: number;
  feedback?: string;
  cancellationReason?: string;
  cancellationCategory?: string;
  rejectionReason?: string;
  cancelledByRole?: string;
  cancelledById?: string;
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [recycleBinCount, setRecycleBinCount] = useState(0);
  
  // Dialog states
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    type: 'reject' | 'cancel' | null;
    appointmentId: string | null;
  }>({ open: false, type: null, appointmentId: null });

  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchAppointments();
    fetchRecycleBinCount();
  }, [isRecycleBinOpen]); // Refresh when recycle bin closes

  const fetchRecycleBinCount = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:5000/api/admin/appointments/recycle-bin/count', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setRecycleBinCount(data.count);
    } catch (error) {
        console.error("Error fetching recycle bin count", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/admin/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      const formatted = data.map((appt: any) => ({
        id: appt.appointment_id.toString(),
        clientName: `${appt.customer_first_name} ${appt.customer_last_name}`,
        service: appt.service_name,
        date: new Date(appt.appointment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: new Date(appt.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        status: appt.status.toLowerCase(),
        phone: appt.customer_phone || 'N/A',
        email: appt.customer_email || 'N/A',
        address: 'N/A', 
        notes: appt.customer_notes || '',
        technician: appt.tech_first_name ? `Tech. ${appt.tech_first_name}` : undefined,
        rawDate: new Date(appt.appointment_date),
        rating: appt.rating,
        feedback: appt.feedback_text,
        cancellationReason: appt.cancellation_reason,
        cancellationCategory: appt.cancellation_category,
        rejectionReason: appt.rejection_reason,
        cancelledByRole: appt.cancelled_by_role,
        cancelledById: appt.cancelled_by_id
      }));

      setAppointments(formatted);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = false;
    if (statusFilter === "all") {
        matchesStatus = true;
    } else if (statusFilter === "upcoming") {
        // Match both 'upcoming' and 'confirmed' for the "Confirmed" filter
        matchesStatus = appointment.status === "upcoming" || appointment.status === "confirmed";
    } else {
        matchesStatus = appointment.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
      if (sortBy === 'date') {
          return sortOrder === 'asc' 
            ? a.rawDate.getTime() - b.rawDate.getTime() 
            : b.rawDate.getTime() - a.rawDate.getTime();
      } else {
          return sortOrder === 'asc'
            ? a.clientName.localeCompare(b.clientName)
            : b.clientName.localeCompare(a.clientName);
      }
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3 mr-1" />;
      case "upcoming":
      case "confirmed":
        return <Calendar className="w-3 h-3 mr-1" />;
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "cancelled":
      case "rejected":
        return <XCircle className="w-3 h-3 mr-1" />;
      case "in-progress":
        return <Loader className="w-3 h-3 mr-1 animate-spin" />;
      default:
        return null;
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleBulkDelete = async () => {
    if (filteredAppointments.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to move ${filteredAppointments.length} appointments to the recycle bin?`)) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const ids = filteredAppointments.map(a => a.id);

        await fetch('http://localhost:5000/api/admin/appointments/bulk-delete', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids })
        });

        setAppointments(appointments.filter(app => !ids.includes(app.id)));
        setRecycleBinCount(prev => prev + ids.length);
        toast.success(`${ids.length} appointments moved to recycle bin`);
    } catch (error) {
        console.error("Error bulk deleting", error);
        toast.error("Failed to move appointments to recycle bin");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: Appointment["status"] | 'deleted', reason?: string, category?: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // If deleting (soft delete)
        if (newStatus === 'deleted') {
             await fetch(`http://localhost:5000/api/admin/appointments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAppointments(appointments.filter(app => app.id !== id));
            setRecycleBinCount(prev => prev + 1);
            toast.success("Appointment moved to recycle bin");
            return;
        }

        // Map frontend status to backend status (Capitalized)
        const backendStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        
        await fetch(`http://localhost:5000/api/admin/appointments/${id}/status`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: backendStatus, reason: reason, category: category })
        });

        setAppointments(appointments.map(app => 
            app.id === id ? { ...app, status: newStatus } : app
        ));
        toast.success(`Appointment status updated to ${newStatus}`);
    } catch (error) {
        console.error("Error updating status", error);
        toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Appointments" 
        description="Manage and schedule service appointments efficiently."
        action={
          <div className="flex gap-2">
             <Button
                variant="outline"
                onClick={() => setIsRecycleBinOpen(true)}
                className="relative flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 border-gray-300 transition-all hover:scale-105"
             >
                <Trash2 className="w-4 h-4" />
                Recycle Bin
                {recycleBinCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        {recycleBinCount}
                    </span>
                )}
             </Button>
            <button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#0B4F6C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#093e54] transition-all shadow-sm hover:shadow-md hover:scale-105"
            >
                <Plus className="w-4 h-4" />
                New Appointment
            </button>
          </div>
        }
      />

      {/* Filters and Sorting */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search client, service, or ID..."
                    className="pl-10 border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex items-center gap-2">
                 <select 
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B4F6C] outline-none transition-all hover:border-[#0B4F6C]"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                 >
                     <option value="date">Sort by Date</option>
                     <option value="name">Sort by Name</option>
                 </select>
                 <button 
                    className="bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all hover:border-[#0B4F6C] hover:text-[#0B4F6C]"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                 >
                     {sortOrder === 'asc' ? '↑' : '↓'}
                 </button>
            </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "upcoming", label: "Confirmed" },
              { id: "in-progress", label: "In Progress" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" }
          ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap capitalize transition-all font-medium border-2 ${
                  statusFilter === filter.id
                    ? "bg-[#0B4F6C] text-white border-[#0B4F6C] shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#0B4F6C] hover:text-[#0B4F6C]"
                }`}
              >
                {filter.label}
              </button>
            )
          )}
          
          <div className="h-6 w-px bg-gray-300 mx-2" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDelete}
            disabled={filteredAppointments.length === 0}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Move All {statusFilter === 'all' ? '' : statusFilter === 'upcoming' ? 'Confirmed' : statusFilter.replace('-', ' ')} to Bin
          </Button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
            onClick={() => handleViewDetails(appointment)}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0B4F6C] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E6F0F4] to-[#F0F7FA] flex items-center justify-center text-[#0B4F6C] shrink-0 shadow-inner">
                  <User className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#0B4F6C] transition-colors">
                        {appointment.clientName}
                    </h3>
                    <Badge variant="outline" className="text-xs font-normal text-gray-500 border-gray-200">
                        #{appointment.id}
                    </Badge>
                  </div>
                  <p className="text-[#0B4F6C] font-medium flex items-center gap-2">
                    {appointment.service}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {appointment.time}
                    </div>
                    {appointment.phone !== 'N/A' && (
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {appointment.phone}
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between gap-4 min-w-[140px]">
                <Badge
                  className={`${getStatusColor(
                    appointment.status
                  )} flex items-center px-3 py-1.5 text-xs font-semibold shadow-sm`}
                >
                  {getStatusIcon(appointment.status)}
                  <span className="capitalize">
                    {appointment.status === 'upcoming' ? 'Confirmed' : appointment.status.replace("-", " ")}
                  </span>
                </Badge>
                
                {appointment.technician && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Technician</p>
                    <p className="text-sm font-medium text-gray-700">{appointment.technician}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                  {appointment.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white shadow-sm border-0"
                        onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 px-4 bg-red-600 hover:bg-red-700 text-white shadow-sm border-0"
                        onClick={() => setStatusDialog({ open: true, type: 'reject', appointmentId: appointment.id })}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {(appointment.status === 'upcoming' || appointment.status === 'confirmed') && (
                      <Button 
                        size="sm" 
                        className="h-8 px-4 bg-orange-600 text-white hover:bg-orange-700 shadow-sm border-0"
                        onClick={() => setStatusDialog({ open: true, type: 'cancel', appointmentId: appointment.id })}
                      >
                        Cancel
                      </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                    onClick={() => handleStatusUpdate(appointment.id, 'deleted')}
                    title="Move to Recycle Bin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <AppointmentDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        appointment={selectedAppointment}
        onUpdateStatus={handleStatusUpdate}
        onCancel={() => {
            setIsDetailsOpen(false);
            if (selectedAppointment) {
                setStatusDialog({ open: true, type: 'cancel', appointmentId: selectedAppointment.id });
            }
        }}
      />

      <RecycleBinDialog 
        open={isRecycleBinOpen}
        onOpenChange={setIsRecycleBinOpen}
      />

      <CreateAppointmentDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
            fetchAppointments();
        }}
      />

      <StatusChangeDialog 
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog(prev => ({ ...prev, open }))}
        title={statusDialog.type === 'reject' ? "Reject Appointment" : "Cancel Appointment"}
        description={statusDialog.type === 'reject' 
            ? "Are you sure you want to reject this appointment? This action cannot be undone." 
            : "Are you sure you want to cancel this confirmed appointment?"}
        actionLabel={statusDialog.type === 'reject' ? "Reject Appointment" : "Cancel Appointment"}
        variant="destructive"
        role="staff"
        onConfirm={async (reason, category) => {
            if (statusDialog.appointmentId) {
                const status = statusDialog.type === 'reject' ? 'rejected' : 'cancelled';
                await handleStatusUpdate(statusDialog.appointmentId, status, reason, category);
            }
        }}
      />
    </div>
  );
}
