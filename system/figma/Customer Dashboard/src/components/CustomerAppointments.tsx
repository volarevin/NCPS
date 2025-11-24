import { useState } from 'react';
import { Plus, Calendar, Clock, Wrench, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AppointmentListCard } from './AppointmentListCard';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';
import { ViewAppointmentDialog } from './ViewAppointmentDialog';
import { EditAppointmentDialog } from './EditAppointmentDialog';
import { CancelAppointmentDialog } from './CancelAppointmentDialog';
import { RateTechnicianDialog } from './RateTechnicianDialog';

type AppointmentStatus = 'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export function CustomerAppointments() {
  const [activeTab, setActiveTab] = useState<AppointmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);

  const appointments = [
    {
      id: '1',
      service: 'Laptop Repair',
      description: 'Screen replacement and keyboard cleaning',
      date: 'November 23, 2025',
      time: '10:00 AM',
      status: 'confirmed' as const,
      technician: 'Tech John Doe',
      technicianPhone: '+63 919 123 4567',
      technicianEmail: 'john.doe@ncps.com',
      address: '123 Main St, Nasugbu, Batangas',
      notes: 'Please bring your laptop charger.',
    },
    {
      id: '2',
      service: 'CCTV Installation',
      description: '4-camera setup with DVR',
      date: 'November 22, 2025',
      time: '2:00 PM',
      status: 'in_progress' as const,
      technician: 'Tech Jane Smith',
      technicianPhone: '+63 919 234 5678',
      technicianEmail: 'jane.smith@ncps.com',
      address: '456 Oak Ave, Nasugbu, Batangas',
      notes: 'Installation at the main entrance and parking area.',
    },
    {
      id: '3',
      service: 'Computer Upgrade',
      description: 'RAM and SSD upgrade',
      date: 'November 20, 2025',
      time: '3:00 PM',
      status: 'completed' as const,
      technician: 'Tech Mike Johnson',
      technicianPhone: '+63 919 345 6789',
      technicianEmail: 'mike.johnson@ncps.com',
      address: '789 Pine Rd, Nasugbu, Batangas',
      notes: 'Completed successfully. System running smoothly.',
    },
    {
      id: '4',
      service: 'Network Setup',
      description: 'Router configuration and WiFi optimization',
      date: 'November 18, 2025',
      time: '1:00 PM',
      status: 'completed' as const,
      technician: 'Tech John Doe',
      technicianPhone: '+63 919 123 4567',
      technicianEmail: 'john.doe@ncps.com',
      address: '123 Main St, Nasugbu, Batangas',
      notes: 'All devices connected successfully.',
    },
    {
      id: '5',
      service: 'Virus Removal',
      description: 'Full system scan and malware removal',
      date: 'November 25, 2025',
      time: '9:00 AM',
      status: 'pending' as const,
      technician: 'Pending assignment',
      technicianPhone: '',
      technicianEmail: '',
      address: '123 Main St, Nasugbu, Batangas',
      notes: 'Awaiting confirmation.',
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesTab = activeTab === 'all' || apt.status === activeTab;
    const matchesSearch =
      apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: 'all' as const, label: 'All', count: appointments.length },
    {
      id: 'pending' as const,
      label: 'Pending',
      count: appointments.filter((a) => a.status === 'pending').length,
    },
    {
      id: 'confirmed' as const,
      label: 'Confirmed',
      count: appointments.filter((a) => a.status === 'confirmed').length,
    },
    {
      id: 'in_progress' as const,
      label: 'In Progress',
      count: appointments.filter((a) => a.status === 'in_progress').length,
    },
    {
      id: 'completed' as const,
      label: 'Completed',
      count: appointments.filter((a) => a.status === 'completed').length,
    },
    {
      id: 'cancelled' as const,
      label: 'Cancelled',
      count: appointments.filter((a) => a.status === 'cancelled').length,
    },
  ];

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  const handleCancel = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsCancelDialogOpen(true);
  };

  const handleRate = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsRateDialogOpen(true);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-3 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-8">
        <div>
          <h1 className="text-[#1A5560] mb-1 text-xl md:text-3xl">Appointments</h1>
          <p className="text-[#1A5560]/70 text-xs md:text-base">Manage and track your service appointments.</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[#3FA9BC] hover:bg-[#2A6570] transition-colors duration-200 w-full sm:w-auto h-9 text-sm"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-2 md:p-4 mb-3 md:mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#1A5560]/40" />
            <Input
              placeholder="Search by service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 text-sm"
            />
          </div>
          <Button
            variant="outline"
            className="border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10 transition-colors duration-200 w-full sm:w-auto h-9 text-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-3 md:mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-2 md:px-6 py-2 md:py-4 transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#3FA9BC] bg-[#3FA9BC]/5 text-[#1A5560]'
                  : 'border-transparent text-[#1A5560]/60 hover:bg-[#1A5560]/5'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 md:gap-2">
                <span className="text-xs md:text-base whitespace-nowrap">{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] md:text-xs ${
                    activeTab === tab.id
                      ? 'bg-[#3FA9BC] text-white'
                      : 'bg-[#1A5560]/10 text-[#1A5560]/70'
                  }`}
                >
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-2 md:space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-[#1A5560]/20 mx-auto mb-4" />
            <h3 className="text-[#1A5560] mb-2 text-sm md:text-base">No appointments found</h3>
            <p className="text-[#1A5560]/60 text-xs md:text-base">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Book your first appointment to get started'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentListCard
              key={appointment.id}
              appointment={appointment}
              onView={handleView}
              onCancel={handleCancel}
              onRate={handleRate}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Dialogs */}
      <CreateAppointmentDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <ViewAppointmentDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={selectedAppointment}
        onEdit={handleEdit}
        onReschedule={handleReschedule}
      />
      <EditAppointmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        appointment={selectedAppointment}
      />
      <CancelAppointmentDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        appointment={selectedAppointment}
      />
      <RateTechnicianDialog
        open={isRateDialogOpen}
        onOpenChange={setIsRateDialogOpen}
        appointment={selectedAppointment}
      />
    </div>
  );
}