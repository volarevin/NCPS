import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Wrench, Search, Filter, Plus, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { AppointmentDetailsDialog } from './AppointmentDetailsDialog';
import { AddAppointmentDialog } from './AddAppointmentDialog';
import { toast } from 'sonner@2.0.3';

export interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  date: string;
  time: string;
  technician: string;
  status: 'pending' | 'in-progress' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Maria Santos',
    phone: '+63 917 345 6789',
    email: 'maria.santos@email.com',
    address: '123 Main St, Quezon City, Metro Manila',
    service: 'Laptop Repair',
    date: 'November 27, 2025',
    time: '10:00 AM',
    technician: 'Tech John Doe',
    status: 'pending',
    notes: "Laptop won't turn on. Client mentioned water damage last week.",
  },
  {
    id: '2',
    clientName: 'Juan Dela Cruz',
    phone: '+63 918 234 5678',
    email: 'juan.delacruz@email.com',
    address: '456 Rizal Ave, Nasugbu, Batangas',
    service: 'CCTV Installation',
    date: 'November 28, 2025',
    time: '2:00 PM',
    technician: 'Tech Jane Smith',
    status: 'in-progress',
    notes: 'Installation of 4-camera CCTV system for home security.',
  },
  {
    id: '3',
    clientName: 'Ana Reyes',
    phone: '+63 919 876 5432',
    email: 'ana.reyes@email.com',
    address: '789 Bonifacio St, Lipa City, Batangas',
    service: 'CCTV Upgrade',
    date: 'November 29, 2025',
    time: '9:00 AM',
    technician: 'Tech Mike Johnson',
    status: 'confirmed',
    notes: 'Upgrade existing CCTV system to HD cameras.',
  },
  {
    id: '4',
    clientName: 'Pedro Garcia',
    phone: '+63 920 123 4567',
    email: 'pedro.garcia@email.com',
    address: '321 Luna St, Taal, Batangas',
    service: 'LCD Replacement',
    date: 'November 30, 2025',
    time: '11:00 AM',
    technician: 'Tech Sarah Lee',
    status: 'completed',
    notes: 'LCD screen replacement for laptop. Completed successfully.',
  },
  {
    id: '5',
    clientName: 'Rosa Mendoza',
    phone: '+63 921 987 6543',
    email: 'rosa.mendoza@email.com',
    address: '654 Del Pilar St, Nasugbu, Batangas',
    service: 'CCTV Repair',
    date: 'December 1, 2025',
    time: '3:00 PM',
    technician: 'Tech John Doe',
    status: 'pending',
    notes: 'Camera 2 not recording. Check wiring and DVR connection.',
  },
];

interface AppointmentScheduleProps {
  selectedAppointmentFromDashboard?: Appointment | null;
  onClearSelection?: () => void;
}

export function AppointmentSchedule({ selectedAppointmentFromDashboard, onClearSelection }: AppointmentScheduleProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Handle appointment selection from dashboard
  useEffect(() => {
    if (selectedAppointmentFromDashboard) {
      setSelectedAppointment(selectedAppointmentFromDashboard);
      setDialogOpen(true);
    }
  }, [selectedAppointmentFromDashboard]);

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open && onClearSelection) {
      onClearSelection();
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(appointments.map(apt => 
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    ));
  };

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
  };

  const handleApproveAppointment = (id: string) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'confirmed' as const } : apt
    ));
    toast.success('Appointment approved');
  };

  const handleRejectAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to reject this appointment?')) {
      setAppointments(appointments.map(apt =>
        apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
      ));
      toast.success('Appointment rejected');
    }
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      setAppointments(appointments.filter(apt => apt.id !== id));
      toast.success('Appointment deleted');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500';
      case 'in-progress':
        return 'bg-blue-400';
      case 'confirmed':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    'in-progress': appointments.filter(apt => apt.status === 'in-progress').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-[#0B4F6C] mb-2">Appointments</h1>
          <p className="text-sm sm:text-base text-[#145A75]">Manage and track customer appointments</p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="bg-[#4DBDCC] hover:bg-[#3AACBB] hover:scale-105 hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Walk-In Appointment</span>
          <span className="sm:hidden">Add Walk-In</span>
        </Button>
      </div>

      {/* Stats Overview with Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-l-4 border-blue-500 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 text-xs sm:text-sm">Total</div>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl text-[#0B4F6C]">{statusCounts.all}</div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-l-4 border-orange-500 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 text-xs sm:text-sm">Pending</div>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <div className="text-xl sm:text-2xl text-[#0B4F6C]">{statusCounts.pending}</div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-l-4 border-blue-400 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 text-xs sm:text-sm truncate">In Progress</div>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-pulse" />
          </div>
          <div className="text-xl sm:text-2xl text-[#0B4F6C]">{statusCounts['in-progress']}</div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-l-4 border-blue-600 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 text-xs sm:text-sm">Confirmed</div>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl text-[#0B4F6C]">{statusCounts.confirmed}</div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-l-4 border-green-500 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 text-xs sm:text-sm">Completed</div>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <div className="text-xl sm:text-2xl text-[#0B4F6C]">{statusCounts.completed}</div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-l-4 border-red-500 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 text-xs sm:text-sm">Cancelled</div>
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
          <div className="text-xl sm:text-2xl text-[#0B4F6C]">{statusCounts.cancelled}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-3 sm:p-4 mb-6 shadow-md hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, service, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus:ring-2 focus:ring-[#4DBDCC] transition-all text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className={`hover:scale-105 transition-transform text-xs sm:text-sm ${filterStatus === 'all' ? 'bg-[#0B4F6C]' : ''}`}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
              className={`hover:scale-105 transition-transform text-xs sm:text-sm ${filterStatus === 'pending' ? 'bg-orange-500' : ''}`}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('in-progress')}
              className={`hover:scale-105 transition-transform text-xs sm:text-sm ${filterStatus === 'in-progress' ? 'bg-blue-400' : ''}`}
            >
              In Progress
            </Button>
            <Button
              variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('confirmed')}
              className={`hover:scale-105 transition-transform text-xs sm:text-sm ${filterStatus === 'confirmed' ? 'bg-blue-600' : ''}`}
            >
              Confirmed
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('completed')}
              className={`hover:scale-105 transition-transform text-xs sm:text-sm ${filterStatus === 'completed' ? 'bg-green-500' : ''}`}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 hover:scale-[1.02] group"
              style={{ borderLeftColor: getStatusColor(appointment.status).replace('bg-', '#') }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <h3 className="text-[#0B4F6C] group-hover:text-[#4DBDCC] transition-colors text-sm sm:text-base">{appointment.clientName}</h3>
                    <Badge className={`${getStatusColor(appointment.status)} text-white text-xs`}>
                      {appointment.status === 'in-progress' ? 'In Progress' : appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2 group-hover:text-[#0B4F6C] transition-colors">
                      <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-[#4DBDCC] flex-shrink-0" />
                      <span className="truncate">{appointment.service}</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-[#0B4F6C] transition-colors">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#4DBDCC] flex-shrink-0" />
                      <span className="truncate">{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-[#0B4F6C] transition-colors">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#4DBDCC] flex-shrink-0" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-[#0B4F6C] transition-colors">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#4DBDCC] flex-shrink-0" />
                      <span className="truncate">{appointment.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-[#0B4F6C] transition-colors sm:col-span-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#4DBDCC] flex-shrink-0" />
                      <span className="truncate">{appointment.technician}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {appointment.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleApproveAppointment(appointment.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectAppointment(appointment.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50 hover:scale-105 transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleViewDetails(appointment)}
                    size="sm"
                    className="bg-[#0B4F6C] hover:bg-[#145A75] hover:scale-105 transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          onUpdateAppointment={handleUpdateAppointment}
        />
      )}

      <AddAppointmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddAppointment={handleAddAppointment}
      />
    </div>
  );
}