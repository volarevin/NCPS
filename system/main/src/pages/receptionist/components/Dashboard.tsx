import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Users,
  Activity,
  TrendingUp
} from 'lucide-react';
import { AddAppointmentDialog } from './AddAppointmentDialog';
import { AppointmentDetailsDialog } from './AppointmentDetailsDialog';
import { StatCard } from './StatCard';
import { Appointment } from './AppointmentSchedule';

// Mock data - In production, this would come from your backend
const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Maria Santos',
    phone: '+63 917 345 6789',
    email: 'maria.santos@email.com',
    address: '123 Main St, Quezon City, Metro Manila',
    service: 'Laptop Repair',
    date: 'November 22, 2025',
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
    date: 'November 22, 2025',
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
    date: 'November 23, 2025',
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
    date: 'November 22, 2025',
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
    date: 'November 23, 2025',
    time: '3:00 PM',
    technician: 'Tech John Doe',
    status: 'confirmed',
    notes: 'Camera 2 not recording. Check wiring and DVR connection.',
  },
];

import { PageHeader } from './PageHeader';

interface DashboardProps {
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function Dashboard({ onAppointmentClick: propOnAppointmentClick }: DashboardProps) {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const onAppointmentClick = (appointment: Appointment) => {
    if (propOnAppointmentClick) {
      propOnAppointmentClick(appointment);
    } else {
      setSelectedAppointment(appointment);
      setIsDetailsOpen(true);
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    'in-progress': appointments.filter(apt => apt.status === 'in-progress').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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

  // Service summary
  const serviceSummary = appointments.reduce((acc, apt) => {
    acc[apt.service] = (acc[apt.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const todayAppointments = appointments.filter(apt => apt.date === 'November 22, 2025'); // Mock date check
  const upcomingAppointments = appointments.filter(apt => apt.date !== 'November 22, 2025');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Dashboard" 
        description="Welcome to NCPS Receptionist Portal"
      />

      {/* Quick Stats with Icons - Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          icon={Clock} 
          color="#F97316" 
        />
        <StatCard 
          title="In Progress" 
          value={stats['in-progress']} 
          icon={Activity} 
          color="#3B82F6" 
        />
        <StatCard 
          title="Confirmed" 
          value={stats.confirmed} 
          icon={CheckCircle} 
          color="#2563EB" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={TrendingUp} 
          color="#22C55E" 
        />
      </div>

      {/* Widgets Row - More Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
        {/* Today's Appointments */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4DBDCC]">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base text-[#0B4F6C] flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#4DBDCC]" />
              Today's Appointments
            </CardTitle>
            <CardDescription className="text-xs">
              {today}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-3 text-xs sm:text-sm">No appointments scheduled for today</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => onAppointmentClick(appointment)}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-[#E5F4F5] to-white rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#0B4F6C] group-hover:text-[#4DBDCC] transition-colors truncate">{appointment.clientName}</p>
                      <p className="text-xs text-gray-600 truncate">{appointment.service}</p>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-xs text-[#0B4F6C]">{appointment.time}</p>
                      <Badge className={`${getStatusColor(appointment.status)} text-white text-xs mt-1`}>
                        {appointment.status === 'in-progress' ? 'In Progress' : appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4DBDCC]">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base text-[#0B4F6C] flex items-center gap-2">
              <Users className="h-4 w-4 text-[#4DBDCC]" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription className="text-xs">
              Next scheduled bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-3 text-xs sm:text-sm">No upcoming appointments</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => onAppointmentClick(appointment)}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-[#E5F4F5] to-white rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#0B4F6C] group-hover:text-[#4DBDCC] transition-colors truncate">{appointment.clientName}</p>
                      <p className="text-xs text-gray-600 truncate">{appointment.service}</p>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-xs text-[#0B4F6C]">{appointment.date}</p>
                      <p className="text-xs text-gray-600">{appointment.time}</p>
                      <Badge className={`${getStatusColor(appointment.status)} text-white text-xs mt-1`}>
                        {appointment.status === 'in-progress' ? 'In Progress' : appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Summary - More Compact */}
      <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4DBDCC]">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base text-[#0B4F6C]">Service Summary by Category</CardTitle>
          <CardDescription className="text-xs">Breakdown of services requested</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {Object.entries(serviceSummary).map(([service, count]) => (
              <div 
                key={service} 
                className="bg-gradient-to-br from-[#E5F4F5] to-white rounded-lg p-3 sm:p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-[#4DBDCC]"
              >
                <div className="text-xl sm:text-2xl text-[#0B4F6C] mb-1 group-hover:text-[#4DBDCC] transition-colors">{count}</div>
                <div className="text-xs text-gray-600 group-hover:text-[#0B4F6C] transition-colors line-clamp-2">{service}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddAppointmentDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAddAppointment={(newAppointment) => console.log('Add appointment', newAppointment)}
      />

      {selectedAppointment && (
        <AppointmentDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          appointment={selectedAppointment}
          onUpdateAppointment={(updatedAppointment) => console.log('Update appointment', updatedAppointment)}
        />
      )}
    </div>
  );
}
