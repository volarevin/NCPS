import { Calendar, Clock, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { NextAppointmentCard } from './NextAppointmentCard';
import { AppointmentUpdateCard } from './AppointmentUpdateCard';
import { useState } from 'react';
import { ViewAppointmentDialog } from './ViewAppointmentDialog';
import { EditAppointmentDialog } from './EditAppointmentDialog';

export function CustomerDashboard() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const stats = [
    {
      icon: Calendar,
      label: 'Total Appointments',
      value: '12',
      color: 'bg-blue-400',
      iconColor: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: '1',
      color: 'bg-orange-300',
      iconColor: 'text-orange-600',
    },
    {
      icon: Wrench,
      label: 'In Progress',
      value: '1',
      color: 'bg-blue-300',
      iconColor: 'text-blue-600',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: '10',
      color: 'bg-green-300',
      iconColor: 'text-green-600',
    },
  ];

  const nextAppointment = {
    service: 'Laptop Repair',
    date: 'November 23, 2025',
    time: '10:00 AM',
    status: 'confirmed' as const,
    technician: 'Tech John Doe',
    technicianPhone: '+63 919 123 4567',
    technicianEmail: 'john.doe@ncps.com',
    address: '123 Main St, Nasugbu, Batangas',
    notes: 'Please bring your laptop charger and any external devices.',
  };

  const recentUpdates = [
    {
      id: '1',
      service: 'CCTV Installation',
      date: 'November 22, 2025',
      time: '2:00 PM',
      status: 'in_progress' as const,
      message: 'Technician is on the way to your location',
    },
    {
      id: '2',
      service: 'Laptop Repair',
      date: 'November 23, 2025',
      time: '10:00 AM',
      status: 'confirmed' as const,
      message: 'Your appointment has been confirmed',
    },
  ];

  return (
    <div className="p-3 md:p-8">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-[#0B4F6C] mb-1 text-xl md:text-3xl">Welcome, Maria Santos!</h1>
        <p className="text-[#0B4F6C]/70 text-xs md:text-base">Here's an overview of your appointments.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        {/* Next Appointment */}
        <NextAppointmentCard 
          appointment={nextAppointment}
          onViewDetails={() => setIsViewDialogOpen(true)}
          onReschedule={() => setIsEditDialogOpen(true)}
        />

        {/* Recent Updates */}
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-3 md:mb-6">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1A5560]" />
            <h2 className="text-[#1A5560] text-base md:text-xl">Recent Updates</h2>
          </div>
          <div className="space-y-2 md:space-y-3">
            {recentUpdates.map((update) => (
              <AppointmentUpdateCard key={update.id} update={update} />
            ))}
          </div>
        </div>
      </div>

      <ViewAppointmentDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={nextAppointment}
        onEdit={() => {
          setIsViewDialogOpen(false);
          setIsEditDialogOpen(true);
        }}
      />

      <EditAppointmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        appointment={nextAppointment}
      />
    </div>
  );
}
