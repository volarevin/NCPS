import { PageHeader } from "./PageHeader";
import { useState } from "react";
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

const initialAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Maria Santos",
    service: "Laptop Repair",
    date: "November 2, 2025",
    time: "10:00 AM",
    status: "pending",
    phone: "+63 912 345 6789",
    email: "maria.santos@email.com",
    address: "123 Main St, Quezon City, Metro Manila",
    notes: "Laptop won't turn on. Client mentioned water damage last week.",
  },
  {
    id: "2",
    clientName: "Juan Dela Cruz",
    service: "CCTV Installation",
    date: "October 30, 2025",
    time: "2:00 PM",
    status: "upcoming",
    phone: "+63 998 765 4321",
    email: "juan.delacruz@email.com",
    address: "456 Rizal Ave, Manila",
    notes: "Installation of 4 camera units for home security.",
    technician: "Tech. Mario",
  },
  {
    id: "3",
    clientName: "Ana Reyes",
    service: "Software Update",
    date: "October 28, 2025",
    time: "11:00 AM",
    status: "completed",
    phone: "+63 917 111 2222",
    email: "ana.reyes@email.com",
    address: "789 EDSA, Makati City",
    notes: "OS update and antivirus installation.",
    technician: "Tech. Luigi",
  },
  {
    id: "4",
    clientName: "Pedro Penduko",
    service: "Network Setup",
    date: "October 25, 2025",
    time: "9:00 AM",
    status: "cancelled",
    phone: "+63 922 333 4444",
    email: "pedro.penduko@email.com",
    address: "101 Bonifacio St, Taguig",
    notes: "Client cancelled due to schedule conflict.",
  },
  {
    id: "5",
    clientName: "Luzviminda Clara",
    service: "Printer Repair",
    date: "November 1, 2025",
    time: "3:00 PM",
    status: "in-progress",
    phone: "+63 908 555 6666",
    email: "luz.clara@email.com",
    address: "202 Mabini St, Pasay",
    notes: "Printer jamming issues.",
    technician: "Tech. Peach",
  },
];

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
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
        return <Calendar className="w-3 h-3 mr-1" />;
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "cancelled":
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

  const handleStatusUpdate = (id: string, newStatus: Appointment["status"]) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Appointments" 
        description="Manage and schedule service appointments efficiently."
        action={
          <button className="bg-[#0B4F6C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#093e54] transition-colors">
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search client or service..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-gray-500" />
          {["all", "pending", "upcoming", "in-progress", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-[#0B4F6C] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status.replace("-", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewDetails(appointment)}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E6F0F4] flex items-center justify-center text-[#0B4F6C] shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {appointment.clientName}
                  </h3>
                  <p className="text-[#0B4F6C] font-medium">
                    {appointment.service}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between gap-2">
                <Badge
                  className={`${getStatusColor(
                    appointment.status
                  )} flex items-center px-3 py-1`}
                >
                  {getStatusIcon(appointment.status)}
                  <span className="capitalize">
                    {appointment.status.replace("-", " ")}
                  </span>
                </Badge>
                {appointment.technician && (
                  <p className="text-sm text-gray-500">
                    Assigned to: <span className="font-medium">{appointment.technician}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No appointments found matching your criteria.</p>
          </div>
        )}
      </div>

      <AppointmentDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        appointment={selectedAppointment}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
}
