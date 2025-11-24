import { useState } from "react";
import { Calendar, Clock, CheckCircle, PlayCircle, XCircle, LogOut, History, Wrench, Menu, X, LayoutDashboard, User, Star, StarHalf, Phone, Mail, MapPin, Edit, Trash2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

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

export default function TechnicianDashboard() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "appointments" | "profile">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  
  // Mock technician data
  const [technicianProfile, setTechnicianProfile] = useState({
    name: "John Technician",
    email: "john.tech@ncps.com",
    phone: "+63 912 345 6789",
    address: "456 Tech Street, Nasugbu, Batangas",
    specialization: "Computer Repair & CCTV Installation",
    rating: 4.8,
    totalJobs: 156
  });

  const technicianRatings = [
    {
      id: "1",
      customerName: "Maria Santos",
      service: "Laptop Repair",
      rating: 5,
      feedback: "Excellent service! My laptop is working perfectly now. Very professional and quick.",
      date: "November 20, 2025"
    },
    {
      id: "2",
      customerName: "Juan Dela Cruz",
      service: "CCTV Installation",
      rating: 5,
      feedback: "Great work! The CCTV system was installed professionally and explained everything clearly.",
      date: "November 18, 2025"
    },
    {
      id: "3",
      customerName: "Ana Reyes",
      service: "PC Upgrade",
      rating: 4,
      feedback: "Good service, very knowledgeable. Could have been a bit faster but overall satisfied.",
      date: "November 15, 2025"
    }
  ];
  
  // Mock data for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      customerName: "Maria Santos",
      service: "Laptop Repair",
      date: "November 27, 2025",
      time: "10:00 AM",
      phone: "+63 917 345 6789",
      email: "maria.santos@email.com",
      address: "123 Main St, Quezon City, Metro Manila",
      status: "Pending",
      notes: "Laptop won't turn on. Client mentioned water damage last week."
    },
    {
      id: "2",
      customerName: "Juan Dela Cruz",
      service: "CCTV Installation",
      date: "November 28, 2025",
      time: "2:00 PM",
      phone: "+63 918 234 5678",
      email: "juan.delacruz@email.com",
      address: "456 Oak Ave, Makati City, Metro Manila",
      status: "In Progress",
      notes: "Installing 4 cameras in the office area. Client prefers wireless setup."
    },
    {
      id: "3",
      customerName: "Ana Reyes",
      service: "PC Upgrade",
      date: "November 29, 2025",
      time: "9:00 AM",
      phone: "+63 919 876 5432",
      email: "ana.reyes@email.com",
      address: "789 Pine Rd, Pasig City, Metro Manila",
      status: "Pending",
      notes: "Upgrade RAM to 16GB and install SSD 500GB."
    }
  ]);

  const [appointmentHistory] = useState<Appointment[]>([
    {
      id: "4",
      customerName: "Pedro Garcia",
      service: "Computer Cleaning",
      date: "November 20, 2025",
      time: "11:00 AM",
      phone: "+63 920 123 4567",
      email: "pedro.garcia@email.com",
      address: "321 Elm St, Taguig City, Metro Manila",
      status: "Completed",
      notes: "Full system cleaning and thermal paste replacement. All parts cleaned thoroughly."
    },
    {
      id: "5",
      customerName: "Lisa Mendoza",
      service: "Virus Removal",
      date: "November 18, 2025",
      time: "3:00 PM",
      phone: "+63 921 987 6543",
      email: "lisa.mendoza@email.com",
      address: "654 Maple Dr, Mandaluyong City, Metro Manila",
      status: "Completed",
      notes: "Removed malware and installed antivirus software. System running smoothly."
    },
    {
      id: "6",
      customerName: "Carlos Ramos",
      service: "Network Setup",
      date: "November 15, 2025",
      time: "1:00 PM",
      phone: "+63 922 456 7890",
      email: "carlos.ramos@email.com",
      address: "987 Cedar Ln, Paranaque City, Metro Manila",
      status: "Cancelled",
      notes: "Client cancelled due to schedule conflict."
    }
  ]);

  const updateAppointmentStatus = (appointmentId: string, newStatus: "Pending" | "In Progress" | "Completed" | "Cancelled") => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
    if (selectedAppointment && selectedAppointment.id === appointmentId) {
      setSelectedAppointment({ ...selectedAppointment, status: newStatus });
    }
  };

  const stats = [
    {
      title: "Total Assigned",
      value: appointments.length,
      subtitle: "Current appointments",
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      title: "Pending",
      value: appointments.filter(a => a.status === "Pending").length,
      subtitle: "Awaiting action",
      icon: <Clock className="w-5 h-5" />,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600"
    },
    {
      title: "In Progress",
      value: appointments.filter(a => a.status === "In Progress").length,
      subtitle: "Currently working",
      icon: <PlayCircle className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      title: "Completed",
      value: appointmentHistory.filter(a => a.status === "Completed").length,
      subtitle: "Successfully finished",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-orange-500 hover:bg-orange-600">{status}</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case "Completed":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const currentAppointments = appointments.filter(a => a.status !== "Completed" && a.status !== "Cancelled");
  const displayAppointments = activeTab === "current" ? currentAppointments : appointmentHistory;

  // Get today's appointments
  const todayAppointments = appointments.filter(a => {
    const today = new Date();
    const appointmentDate = new Date(a.date);
    return appointmentDate.toDateString() === today.toDateString();
  });

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments.filter(a => {
    const today = new Date();
    const appointmentDate = new Date(a.date);
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion requested. Please contact the administrator to complete this process.");
    }
  };

  return (
    <div className="flex h-screen bg-[#C5E8E5] overflow-hidden">
      {/* Mobile Header - Fixed at top */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0B4F6C] text-white shadow-lg">
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#4DBDCC] flex items-center justify-center bg-[#4DBDCC] p-1.5">
              <img 
                src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
                alt="NCPS Logo"
                className="w-full h-full"
              />
            </div>
            <span className="text-xl font-bold">NCPS</span>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Sidebar Overlay - Blur effect instead of black */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-sm bg-black/20 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#0B4F6C] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 border-[#0B4F6C] flex items-center justify-center overflow-hidden bg-[#4DBDCC] p-2">
            <img 
              src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
              alt="Security Camera"
              className="w-10 h-10 lg:w-14 lg:h-14"
            />
          </div>
          <span className="text-xl lg:text-2xl font-bold">NCPS</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "dashboard" 
                ? "bg-[#4DBDCC] text-white shadow-lg scale-105" 
                : "text-gray-300 hover:bg-[#084461] hover:translate-x-1"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("appointments");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "appointments" 
                ? "bg-[#4DBDCC] text-white shadow-lg scale-105" 
                : "text-gray-300 hover:bg-[#084461] hover:translate-x-1"
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span>Appointments</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("profile");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "profile" 
                ? "bg-[#4DBDCC] text-white shadow-lg scale-105" 
                : "text-gray-300 hover:bg-[#084461] hover:translate-x-1"
            }`}
          >
            <User className="w-5 h-5" />
            <span>My Profile</span>
          </button>
        </nav>

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full bg-transparent border-white text-white hover:bg-[#084461] hover:text-white hover:scale-105 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-3 lg:p-8 pt-[70px] lg:pt-8">
          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <>
              <div className="mb-4 lg:mb-8">
                <h1 className="text-xl lg:text-3xl text-[#0B4F6C] mb-1">Dashboard</h1>
                <p className="text-xs lg:text-base text-[#0B4F6C]/70">Welcome back, {technicianProfile.name.split(' ')[0]}!</p>
              </div>

              {/* Stats Grid - More compact on mobile */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-4 lg:mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.color} border-2 rounded-lg lg:rounded-xl p-2.5 lg:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group`}
                  >
                    <div className="flex flex-col gap-1 lg:gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] lg:text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">{stat.title}</span>
                        <div className={`${stat.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-xl lg:text-3xl text-gray-900 font-bold leading-none">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Appointments */}
              <div className="mb-4 lg:mb-6">
                <Card className="border-2 border-[#0B4F6C]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-[#0B4F6C] to-[#084461] text-white rounded-t-lg p-3 lg:p-6">
                    <CardTitle className="flex items-center gap-2 text-base lg:text-xl">
                      <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                      Today's Appointments
                    </CardTitle>
                    <CardDescription className="text-gray-200 text-xs lg:text-sm">
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-3 lg:pt-6 p-3 lg:p-6">
                    {todayAppointments.length === 0 ? (
                      <div className="text-center py-6 lg:py-8 text-gray-500">
                        <Calendar className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 text-gray-400" />
                        <p className="text-sm lg:text-base">No appointments for today</p>
                      </div>
                    ) : (
                      <div className="space-y-2 lg:space-y-3">
                        {todayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="bg-[#E8F5F4] rounded-lg p-3 lg:p-4 border-l-4 border-[#0B4F6C] hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm lg:text-base text-gray-900 font-semibold truncate">{appointment.customerName}</h3>
                                <p className="text-xs text-gray-600 truncate">{appointment.service}</p>
                              </div>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-xs lg:text-sm text-gray-700">
                                <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C]" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex gap-1.5">
                                <Button
                                  onClick={() => setSelectedAppointment(appointment)}
                                  className="bg-[#0B4F6C] hover:bg-[#084461] text-white h-7 text-xs lg:h-8 lg:text-sm px-2 lg:px-3"
                                  size="sm"
                                >
                                  View
                                </Button>
                                {appointment.status === "Pending" && (
                                  <Button
                                    onClick={() => updateAppointmentStatus(appointment.id, "In Progress")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white h-7 text-xs lg:h-8 lg:text-sm px-2 lg:px-3"
                                    size="sm"
                                  >
                                    Start
                                  </Button>
                                )}
                                {appointment.status === "In Progress" && (
                                  <Button
                                    onClick={() => updateAppointmentStatus(appointment.id, "Completed")}
                                    className="bg-green-500 hover:bg-green-600 text-white h-7 text-xs lg:h-8 lg:text-sm px-2 lg:px-3"
                                    size="sm"
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments */}
              <div>
                <Card className="border-2 border-[#4DBDCC]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-[#4DBDCC] to-[#0B4F6C] text-white rounded-t-lg p-3 lg:p-6">
                    <CardTitle className="flex items-center gap-2 text-base lg:text-xl">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                      Upcoming Appointments
                    </CardTitle>
                    <CardDescription className="text-gray-200 text-xs lg:text-sm">
                      Next scheduled bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-3 lg:pt-6 p-3 lg:p-6">
                    {upcomingAppointments.length === 0 ? (
                      <div className="text-center py-6 lg:py-8 text-gray-500">
                        <Clock className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 text-gray-400" />
                        <p className="text-sm lg:text-base">No upcoming appointments</p>
                      </div>
                    ) : (
                      <div className="space-y-2 lg:space-y-3">
                        {upcomingAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="bg-[#E8F5F4] rounded-lg p-3 lg:p-4 border-l-4 border-[#4DBDCC] hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm lg:text-base text-gray-900 font-semibold truncate">{appointment.customerName}</h3>
                                <p className="text-xs text-gray-600 truncate">{appointment.service}</p>
                              </div>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="flex items-center justify-between gap-2 text-xs lg:text-sm text-gray-700">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C]" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C]" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                              <Button
                                onClick={() => setSelectedAppointment(appointment)}
                                className="bg-[#0B4F6C] hover:bg-[#084461] text-white h-7 text-xs lg:h-8 lg:text-sm px-2 lg:px-3"
                                size="sm"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Appointments View */}
          {activeTab === "appointments" && (
            <>
              <div className="mb-4 lg:mb-8">
                <h1 className="text-xl lg:text-3xl text-[#0B4F6C] mb-1">Appointments</h1>
                <p className="text-xs lg:text-base text-[#0B4F6C]/70">Manage all your appointments</p>
              </div>

              {/* All Appointments */}
              <Card className="border-2 border-[#0B4F6C]/20 shadow-lg mb-4 lg:mb-6">
                <CardHeader className="bg-gradient-to-r from-[#0B4F6C] to-[#084461] text-white rounded-t-lg p-3 lg:p-6">
                  <CardTitle className="flex items-center gap-2 text-base lg:text-xl">
                    <Wrench className="w-4 h-4 lg:w-5 lg:h-5" />
                    All Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 lg:pt-6 p-3 lg:p-6">
                  {currentAppointments.length === 0 ? (
                    <div className="text-center py-8 lg:py-12 text-gray-500">
                      <Wrench className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 text-gray-400" />
                      <p className="text-sm lg:text-base">No active appointments</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 lg:space-y-4">
                      {currentAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="bg-[#E8F5F4] rounded-lg p-3 lg:p-5 border-l-4 border-[#0B4F6C] hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 lg:gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 lg:gap-3 mb-1.5 lg:mb-2">
                                <h3 className="text-sm lg:text-lg text-gray-900 font-semibold">{appointment.customerName}</h3>
                                {getStatusBadge(appointment.status)}
                              </div>
                              <div className="space-y-0.5 lg:space-y-1 text-xs lg:text-sm text-gray-700">
                                <div className="flex items-center gap-1.5 lg:gap-2">
                                  <Wrench className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C] flex-shrink-0" />
                                  <span className="truncate">{appointment.service}</span>
                                </div>
                                <div className="flex items-center gap-1.5 lg:gap-2">
                                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C] flex-shrink-0" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5 lg:gap-2">
                                  <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-[#0B4F6C] flex-shrink-0" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row lg:flex-col gap-1.5 lg:gap-2">
                              <Button
                                onClick={() => setSelectedAppointment(appointment)}
                                className="bg-[#0B4F6C] hover:bg-[#084461] text-white flex-1 lg:flex-initial h-8 text-xs lg:text-sm"
                                size="sm"
                              >
                                View Details
                              </Button>
                              {appointment.status !== "Completed" && appointment.status !== "Cancelled" && (
                                <div className="flex gap-1.5 flex-1 lg:flex-initial">
                                  {appointment.status === "Pending" && (
                                    <Button
                                      onClick={() => updateAppointmentStatus(appointment.id, "In Progress")}
                                      className="bg-blue-500 hover:bg-blue-600 text-white flex-1 h-8 text-xs lg:text-sm px-2"
                                      size="sm"
                                    >
                                      <PlayCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                      <span className="hidden sm:inline">Start</span>
                                    </Button>
                                  )}
                                  {appointment.status === "In Progress" && (
                                    <Button
                                      onClick={() => updateAppointmentStatus(appointment.id, "Completed")}
                                      className="bg-green-500 hover:bg-green-600 text-white flex-1 h-8 text-xs lg:text-sm px-2"
                                      size="sm"
                                    >
                                      <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                      <span className="hidden sm:inline">Done</span>
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Appointment History */}
              <Card className="border-2 border-gray-300 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg p-3 lg:p-6">
                  <CardTitle className="flex items-center gap-2 text-base lg:text-xl">
                    <History className="w-4 h-4 lg:w-5 lg:h-5" />
                    History
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 lg:pt-6 p-3 lg:p-6">
                  {appointmentHistory.length === 0 ? (
                    <div className="text-center py-8 lg:py-12 text-gray-500">
                      <History className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 text-gray-400" />
                      <p className="text-sm lg:text-base">No history yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 lg:space-y-4">
                      {appointmentHistory.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="bg-gray-50 rounded-lg p-3 lg:p-5 border-l-4 border-gray-400 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 lg:gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 lg:gap-3 mb-1.5 lg:mb-2">
                                <h3 className="text-sm lg:text-lg text-gray-900 font-semibold">{appointment.customerName}</h3>
                                {getStatusBadge(appointment.status)}
                              </div>
                              <div className="space-y-0.5 lg:space-y-1 text-xs lg:text-sm text-gray-700">
                                <div className="flex items-center gap-1.5 lg:gap-2">
                                  <Wrench className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600 flex-shrink-0" />
                                  <span className="truncate">{appointment.service}</span>
                                </div>
                                <div className="flex items-center gap-1.5 lg:gap-2">
                                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600 flex-shrink-0" />
                                  <span>{appointment.date}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => setSelectedAppointment(appointment)}
                              variant="outline"
                              className="border-gray-400 text-gray-700 hover:bg-gray-100 h-8 text-xs lg:text-sm"
                              size="sm"
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Profile View */}
          {activeTab === "profile" && (
            <>
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl text-[#0B4F6C] mb-2">My Profile</h1>
                <p className="text-sm lg:text-base text-[#0B4F6C]/70">Manage your account information and view ratings</p>
              </div>

              {/* Profile Information */}
              <Card className="border-2 border-[#0B4F6C]/20 shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-[#0B4F6C] to-[#084461] text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Account Information
                    </CardTitle>
                    {!editingProfile && (
                      <Button
                        onClick={() => setEditingProfile(true)}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white text-white hover:bg-white/20 hover:scale-105 transition-all"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex justify-center lg:justify-start">
                      <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-[#4DBDCC] shadow-lg hover:scale-105 transition-transform">
                        <AvatarFallback className="bg-[#4DBDCC] text-white text-3xl lg:text-4xl">
                          {technicianProfile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="text-sm text-gray-600 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name
                          </label>
                          {editingProfile ? (
                            <input
                              type="text"
                              value={technicianProfile.name}
                              onChange={(e) => setTechnicianProfile({...technicianProfile, name: e.target.value})}
                              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0B4F6C] focus:ring-2 focus:ring-[#0B4F6C]/20 transition-all"
                            />
                          ) : (
                            <p className="text-gray-900 mt-1 font-semibold">{technicianProfile.name}</p>
                          )}
                        </div>
                        <div className="group">
                          <label className="text-sm text-gray-600 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </label>
                          {editingProfile ? (
                            <input
                              type="email"
                              value={technicianProfile.email}
                              onChange={(e) => setTechnicianProfile({...technicianProfile, email: e.target.value})}
                              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0B4F6C] focus:ring-2 focus:ring-[#0B4F6C]/20 transition-all"
                            />
                          ) : (
                            <p className="text-gray-900 mt-1">{technicianProfile.email}</p>
                          )}
                        </div>
                        <div className="group">
                          <label className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone Number
                          </label>
                          {editingProfile ? (
                            <input
                              type="tel"
                              value={technicianProfile.phone}
                              onChange={(e) => setTechnicianProfile({...technicianProfile, phone: e.target.value})}
                              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0B4F6C] focus:ring-2 focus:ring-[#0B4F6C]/20 transition-all"
                            />
                          ) : (
                            <p className="text-gray-900 mt-1">{technicianProfile.phone}</p>
                          )}
                        </div>
                        <div className="group">
                          <label className="text-sm text-gray-600 flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            Specialization
                          </label>
                          {editingProfile ? (
                            <input
                              type="text"
                              value={technicianProfile.specialization}
                              onChange={(e) => setTechnicianProfile({...technicianProfile, specialization: e.target.value})}
                              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0B4F6C] focus:ring-2 focus:ring-[#0B4F6C]/20 transition-all"
                            />
                          ) : (
                            <p className="text-gray-900 mt-1">{technicianProfile.specialization}</p>
                          )}
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Address
                        </label>
                        {editingProfile ? (
                          <textarea
                            value={technicianProfile.address}
                            onChange={(e) => setTechnicianProfile({...technicianProfile, address: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0B4F6C] focus:ring-2 focus:ring-[#0B4F6C]/20 transition-all"
                            rows={2}
                          />
                        ) : (
                          <p className="text-gray-900 mt-1">{technicianProfile.address}</p>
                        )}
                      </div>
                      {editingProfile && (
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => {
                              setEditingProfile(false);
                              alert("Profile updated successfully!");
                            }}
                            className="bg-[#0B4F6C] hover:bg-[#084461] text-white hover:scale-105 transition-transform"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            onClick={() => setEditingProfile(false)}
                            variant="outline"
                            className="border-gray-400 text-gray-700 hover:bg-gray-100 hover:scale-105 transition-transform"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-[#E8F5F4] rounded-lg p-4 border-l-4 border-[#4DBDCC] hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#4DBDCC] p-3 rounded-full">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Overall Rating</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl text-gray-900 font-bold">{technicianProfile.rating}</span>
                            <div className="flex">{renderStars(technicianProfile.rating)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#E8F5F4] rounded-lg p-4 border-l-4 border-[#0B4F6C] hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#0B4F6C] p-3 rounded-full">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Completed Jobs</p>
                          <span className="text-2xl text-gray-900 font-bold">{technicianProfile.totalJobs}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ratings and Feedback */}
              <Card className="border-2 border-yellow-400/20 shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Customer Ratings & Feedback
                  </CardTitle>
                  <CardDescription className="text-gray-800">
                    See what customers are saying about your work
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {technicianRatings.map((rating) => (
                      <div
                        key={rating.id}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 lg:p-5 border-l-4 border-yellow-400 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-base lg:text-lg text-gray-900 font-semibold">{rating.customerName}</h3>
                            <p className="text-sm text-gray-600">{rating.service}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(rating.rating)}
                          </div>
                        </div>
                        <p className="text-sm lg:text-base text-gray-700 italic mb-2">"{rating.feedback}"</p>
                        <p className="text-xs text-gray-500">{rating.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-2 border-red-500/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Once you delete your account, there is no going back. Please be certain.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    className="hover:scale-105 transition-transform"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdateStatus={updateAppointmentStatus}
          isTechnician={true}
        />
      )}
    </div>
  );
}