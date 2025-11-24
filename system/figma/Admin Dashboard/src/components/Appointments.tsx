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
  AlertCircle,
  XCircle,
  Loader,
} from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

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
    status: "in-progress",
    phone: "+63 923 456 7890",
    email: "juan.delacruz@email.com",
    address: "456 Oak Ave, Makati City, Metro Manila",
    notes: "4-camera installation for home security. Client prefers weatherproof cameras.",
    technician: "Tech Mike Wilson",
  },
  {
    id: "3",
    clientName: "Ana Rodriguez",
    service: "LCD Replacement",
    date: "October 28, 2025",
    time: "9:30 AM",
    status: "completed",
    phone: "+63 934 567 8901",
    email: "ana.rodriguez@email.com",
    address: "789 Pine Rd, Pasig City, Metro Manila",
    notes: "Cracked screen on Dell laptop. Replacement completed successfully.",
    technician: "Tech Sarah Lee",
  },
  {
    id: "4",
    clientName: "Carlos Mendoza",
    service: "CCTV Repair",
    date: "October 29, 2025",
    time: "11:00 AM",
    status: "completed",
    phone: "+63 945 678 9012",
    email: "carlos.mendoza@email.com",
    address: "321 Elm St, Taguig City, Metro Manila",
    notes: "Two cameras not recording. Issue was with DVR connection.",
    technician: "Tech Mike Wilson",
  },
  {
    id: "5",
    clientName: "Lisa Garcia",
    service: "Laptop Repair",
    date: "October 27, 2025",
    time: "3:00 PM",
    status: "cancelled",
    phone: "+63 956 789 0123",
    email: "lisa.garcia@email.com",
    address: "654 Maple Dr, Mandaluyong City, Metro Manila",
    notes: "Client cancelled - decided to buy new laptop instead.",
  },
  {
    id: "6",
    clientName: "Robert Tan",
    service: "CCTV Upgrade",
    date: "November 3, 2025",
    time: "1:30 PM",
    status: "upcoming",
    phone: "+63 967 890 1234",
    email: "robert.tan@email.com",
    address: "987 Cedar Ln, San Juan City, Metro Manila",
    notes: "Upgrade from analog to IP cameras. 6 cameras total.",
    technician: "Tech John Doe",
  },
  {
    id: "7",
    clientName: "Patricia Reyes",
    service: "LCD Replacement",
    date: "November 1, 2025",
    time: "10:30 AM",
    status: "upcoming",
    phone: "+63 978 901 2345",
    email: "patricia.reyes@email.com",
    address: "147 Birch St, Parañaque City, Metro Manila",
    notes: "MacBook Pro 15-inch screen replacement needed.",
  },
];

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Upcoming", value: "upcoming" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialAppointments
  );
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      selectedStatus === "all" || appointment.status === selectedStatus;
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleUpdateStatus = (id: string, status: Appointment["status"]) => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const handleApprove = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "upcoming" as const } : apt
      )
    );
  };

  const handleReject = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled" as const } : apt
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  const countByStatus = (status: string) => {
    if (status === "all") return appointments.length;
    return appointments.filter((apt) => apt.status === status).length;
  };

  const stats = [
    {
      icon: Clock,
      value: appointments.filter(a => a.status === "pending").length.toString(),
      label: "Pending",
      bgColor: "from-orange-500 to-orange-600",
    },
    {
      icon: CheckCircle,
      value: appointments.filter(a => a.status === "upcoming").length.toString(),
      label: "Upcoming",
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      icon: Loader,
      value: appointments.filter(a => a.status === "in-progress").length.toString(),
      label: "In Progress",
      bgColor: "from-yellow-500 to-yellow-600",
    },
    {
      icon: CheckCircle,
      value: appointments.filter(a => a.status === "completed").length.toString(),
      label: "Completed",
      bgColor: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl text-[#0B4F6C] font-bold">Appointments</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage and track all appointments</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all shadow-md hover:shadow-lg text-sm md:text-base w-fit">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          New Appointment
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-4 text-white`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
                <span className="text-xl md:text-2xl">{stat.value}</span>
              </div>
              <p className="text-xs md:text-sm opacity-90">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border-2 border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <Input
              placeholder="Search by client name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 h-10 md:h-12 bg-gray-50 border-gray-200 focus:border-[#0B4F6C] text-sm md:text-base"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm shadow-sm ${
                  selectedStatus === filter.value
                    ? "bg-[#0B4F6C] text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
                <span
                  className={`ml-1.5 md:ml-2 px-1.5 md:px-2 py-0.5 rounded-full text-xs ${
                    selectedStatus === filter.value
                      ? "bg-white/20 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {countByStatus(filter.value)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            onClick={() => handleAppointmentClick(appointment)}
            className="group bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#0B4F6C] transform hover:-translate-y-1"
          >
            {/* Header with status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#0B4F6C] to-[#0D6A8C] flex items-center justify-center text-white shadow-md">
                  {appointment.clientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm md:text-base text-gray-800 group-hover:text-[#0B4F6C] transition-colors">
                    {appointment.clientName}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">{appointment.service}</p>
                </div>
              </div>
              <Badge
                className={`${getStatusColor(appointment.status)} border text-xs px-2.5 py-1`}
              >
                {getStatusText(appointment.status)}
              </Badge>
            </div>

            {/* Date and Time */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-[#0B4F6C]" />
                  <span className="text-xs md:text-sm">{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4 text-[#0B4F6C]" />
                  <span className="text-xs md:text-sm">{appointment.time}</span>
                </div>
              </div>
            </div>

            {/* Technician */}
            {appointment.technician && (
              <div className="flex items-center gap-2 text-gray-600 pt-3 border-t border-gray-200">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-xs md:text-sm">{appointment.technician}</span>
              </div>
            )}

            {/* Hover indicator */}
            <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-right">
              Click for details →
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No appointments found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={selectedAppointment}
        onUpdateStatus={handleUpdateStatus}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}