import { useState } from 'react';
import { Plus, Calendar, Search } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { AppointmentListCard } from './AppointmentListCard';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';
import { ViewAppointmentDialog } from './ViewAppointmentDialog';
import { EditAppointmentDialog } from './EditAppointmentDialog';
import { CancelAppointmentDialog } from './CancelAppointmentDialog';
import { RateTechnicianDialog } from './RateTechnicianDialog';
import { PageHeader } from './PageHeader';

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
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-3 md:p-8 animate-fade-in max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader 
        title="My Appointments"
        description="Manage and track your service requests."
        action={
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#3FA9BC] hover:bg-[#2A6570] transition-colors duration-200 shadow-md hover:shadow-lg w-full md:w-auto"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Book Appointment
          </Button>
        }
      />

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 border-gray-200 focus:border-[#3FA9BC] focus:ring-[#3FA9BC] h-9 md:h-10 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AppointmentStatus)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#1A5560] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 md:space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentListCard
              key={appointment.id}
              appointment={appointment}
              onView={(apt) => {
                setSelectedAppointment(apt);
                setIsViewDialogOpen(true);
              }}
              onCancel={(apt) => {
                setSelectedAppointment(apt);
                setIsCancelDialogOpen(true);
              }}
              onRate={(apt) => {
                setSelectedAppointment(apt);
                setIsRateDialogOpen(true);
              }}
              onEdit={(apt) => {
                setSelectedAppointment(apt);
                setIsEditDialogOpen(true);
              }}
            />
          ))
        ) : (
          <div className="text-center py-8 md:py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            </div>
            <h3 className="text-[#1A5560] font-medium mb-1 text-sm md:text-base">No appointments found</h3>
            <p className="text-gray-500 text-xs md:text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <ViewAppointmentDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={selectedAppointment}
        onEdit={(apt) => {
          setIsViewDialogOpen(false);
          setSelectedAppointment(apt);
          setIsEditDialogOpen(true);
        }}
        onReschedule={(apt) => {
          setIsViewDialogOpen(false);
          setSelectedAppointment(apt);
          setIsEditDialogOpen(true);
        }}
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
