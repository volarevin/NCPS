import { useState } from "react";
import { Calendar, Clock, CheckCircle, PlayCircle, Star, StarHalf } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { TechnicianSidebar } from "./components/TechnicianSidebar";
import { TechnicianDashboardContent } from "./components/TechnicianDashboardContent";
import { TechnicianAppointments } from "./components/TechnicianAppointments";
import { TechnicianProfile } from "./components/TechnicianProfile";
import { TechnicianRatings } from "./components/TechnicianRatings";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";
import { MobileHeader } from "./components/MobileHeader";

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

export default function TechnicianPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "appointments" | "profile" | "ratings">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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
      color: "border-l-blue-500",
      iconColor: "text-blue-600"
    },
    {
      title: "Pending",
      value: appointments.filter(a => a.status === "Pending").length,
      subtitle: "Awaiting action",
      icon: <Clock className="w-5 h-5" />,
      color: "border-l-orange-500",
      iconColor: "text-orange-600"
    },
    {
      title: "In Progress",
      value: appointments.filter(a => a.status === "In Progress").length,
      subtitle: "Currently working",
      icon: <PlayCircle className="w-5 h-5" />,
      color: "border-l-blue-600",
      iconColor: "text-blue-600"
    },
    {
      title: "Completed",
      value: appointmentHistory.filter(a => a.status === "Completed").length,
      subtitle: "Successfully finished",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "border-l-green-500",
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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <TechnicianDashboardContent
            technicianProfile={technicianProfile}
            stats={stats}
            todayAppointments={todayAppointments}
            upcomingAppointments={upcomingAppointments}
            setSelectedAppointment={setSelectedAppointment}
            setActiveTab={setActiveTab}
            getStatusBadge={getStatusBadge}
          />
        );
      case "appointments":
        return (
          <TechnicianAppointments
            appointments={appointments}
            setSelectedAppointment={setSelectedAppointment}
            updateAppointmentStatus={updateAppointmentStatus}
            getStatusBadge={getStatusBadge}
          />
        );
      case "ratings":
        return (
          <TechnicianRatings
            ratings={technicianRatings}
            renderStars={renderStars}
          />
        );
      case "profile":
        return (
          <TechnicianProfile
            technicianProfile={technicianProfile}
            setTechnicianProfile={setTechnicianProfile}
            technicianRatings={technicianRatings}
            handleDeleteAccount={handleDeleteAccount}
            renderStars={renderStars}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-sm bg-black/20 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <TechnicianSidebar
        currentPage={activeTab}
        onNavigate={(page) => {
          setActiveTab(page);
          setSidebarOpen(false);
        }}
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0">
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {renderContent()}
        </main>
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
