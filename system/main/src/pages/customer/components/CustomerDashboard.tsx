import { Calendar, Clock, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { NextAppointmentCard } from './NextAppointmentCard';
import { AppointmentUpdateCard } from './AppointmentUpdateCard';
import { useState, useEffect } from 'react';
import { ViewAppointmentDialog } from './ViewAppointmentDialog';
import { EditAppointmentDialog } from './EditAppointmentDialog';
import { PageHeader } from './PageHeader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [nextAppointment, setNextAppointment] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Stats
        const statsRes = await fetch('http://localhost:5000/api/customer/stats', { headers });
        
        if (statsRes.status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const statsData = await statsRes.json();
        setDashboardStats(statsData);

        // Fetch Next Appointment (from appointments list)
        const apptRes = await fetch('http://localhost:5000/api/customer/appointments', { headers });
        
        if (apptRes.status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const apptData = await apptRes.json();
        
        // Find the first upcoming appointment
        const upcoming = apptData.find((a: any) => 
          ['Pending', 'Confirmed'].includes(a.status) && new Date(a.appointment_date) > new Date()
        );

        if (upcoming) {
          setNextAppointment({
            service: upcoming.service_name,
            date: new Date(upcoming.appointment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            time: new Date(upcoming.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            status: upcoming.status.toLowerCase(),
            technician: upcoming.tech_first_name ? `Tech ${upcoming.tech_first_name} ${upcoming.tech_last_name}` : 'Pending Assignment',
            technicianPhone: '', // TODO: Add to API
            technicianEmail: '', // TODO: Add to API
            address: '123 Main St, Nasugbu, Batangas', // TODO: Add address to appointment/user
            notes: upcoming.customer_notes || 'No notes provided.',
          });
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, []);
  
  const stats = [
    {
      icon: Calendar,
      title: 'Total Appointments',
      value: dashboardStats ? (dashboardStats.pending_count + dashboardStats.completed_count).toString() : '0', // Approximation
      color: '#4DBDCC',
    },
    {
      icon: Clock,
      title: 'Pending',
      value: dashboardStats?.pending_count?.toString() || '0',
      color: '#F97316', // Orange
    },
    {
      icon: Wrench,
      title: 'In Progress',
      value: '0', // TODO: Add to API stats
      color: '#3B82F6', // Blue
    },
    {
      icon: CheckCircle2,
      title: 'Completed',
      value: dashboardStats?.completed_count?.toString() || '0',
      color: '#22C55E', // Green
    },
  ];

  const defaultNextAppointment = {
    service: 'No Upcoming Appointments',
    date: '-',
    time: '-',
    status: 'pending' as const,
    technician: '-',
    technicianPhone: '-',
    technicianEmail: '-',
    address: '-',
    notes: '-',
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
    <div className="p-3 md:p-8 animate-fade-in max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader 
        title={`Welcome, ${user?.firstName || 'Customer'}!`}
        description="Here's an overview of your appointments."
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        {/* Next Appointment */}
        <NextAppointmentCard 
          appointment={nextAppointment || defaultNextAppointment}
          onViewDetails={() => setIsViewDialogOpen(true)}
          onReschedule={() => setIsEditDialogOpen(true)}
        />

        {/* Recent Updates */}
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex items-center gap-2 mb-3 md:mb-6">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-[#4DBDCC]" />
            <h2 className="text-[#0B4F6C] font-semibold text-sm md:text-lg">Recent Updates</h2>
          </div>
          <div className="space-y-3 md:space-y-4">
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
