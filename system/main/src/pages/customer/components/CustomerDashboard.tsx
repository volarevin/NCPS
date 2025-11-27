import { 
  Calendar, Clock, Wrench, CheckCircle2, AlertCircle, Plus
} from 'lucide-react';
import { StatCard } from './StatCard';
import { NextAppointmentCard } from './NextAppointmentCard';
import { AppointmentUpdateCard } from './AppointmentUpdateCard';
import { useState, useEffect } from 'react';
import { ViewAppointmentDialog } from './ViewAppointmentDialog';
import { EditAppointmentDialog } from './EditAppointmentDialog';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';
import { PageHeader } from './PageHeader';
import { ServiceBanner } from './ServiceBanner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [nextAppointment, setNextAppointment] = useState<any>(null);
  const [todaysAppointment, setTodaysAppointment] = useState<any>(null);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
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

        // Fetch Appointments
        const apptRes = await fetch('http://localhost:5000/api/customer/appointments', { headers });
        
        if (apptRes.status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const apptData = await apptRes.json();
        
        const now = new Date();
        const todayStr = now.toDateString();

        // Find today's appointment
        const todayAppt = apptData.find((a: any) => {
            const d = new Date(a.appointment_date);
            return d.toDateString() === todayStr && ['Pending', 'Confirmed', 'In Progress'].includes(a.status);
        });

        if (todayAppt) {
             setTodaysAppointment({
                id: todayAppt.id,
                service: todayAppt.service_name,
                date: 'Today',
                time: new Date(todayAppt.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                status: todayAppt.status.toLowerCase(),
                technician: todayAppt.tech_first_name ? `Tech ${todayAppt.tech_first_name} ${todayAppt.tech_last_name}` : 'Pending Assignment',
                technicianPhone: '', 
                technicianEmail: '',
                address: '123 Main St, Nasugbu, Batangas',
                notes: todayAppt.customer_notes || 'No notes provided.',
             });
        } else {
            setTodaysAppointment(null);
        }

        // Find next appointment (future, not today)
        const upcoming = apptData.find((a: any) => {
             const d = new Date(a.appointment_date);
             return d > now && d.toDateString() !== todayStr && ['Pending', 'Confirmed'].includes(a.status);
        });

        if (upcoming) {
          setNextAppointment({
            id: upcoming.id,
            service: upcoming.service_name,
            date: new Date(upcoming.appointment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            time: new Date(upcoming.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            status: upcoming.status.toLowerCase(),
            technician: upcoming.tech_first_name ? `Tech ${upcoming.tech_first_name} ${upcoming.tech_last_name}` : 'Pending Assignment',
            technicianPhone: '', 
            technicianEmail: '', 
            address: '123 Main St, Nasugbu, Batangas', 
            notes: upcoming.customer_notes || 'No notes provided.',
          });
        } else {
            setNextAppointment(null);
        }

        // Recent Updates
        const sorted = [...apptData].sort((a: any, b: any) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());
        const updates = sorted.slice(0, 3).map((a: any) => ({
            id: a.id,
            service: a.service_name,
            date: new Date(a.appointment_date).toLocaleDateString(),
            time: new Date(a.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: a.status.toLowerCase(),
            message: `Status: ${a.status}`,
            // Full object for dialog
            description: a.customer_notes,
            technician: a.tech_first_name ? `Tech ${a.tech_first_name} ${a.tech_last_name}` : 'Pending Assignment',
            technicianPhone: '',
            technicianEmail: '',
            address: '123 Main St, Nasugbu, Batangas',
            notes: a.customer_notes || 'No notes provided.',
        }));
        setRecentUpdates(updates);

        // Fetch Featured Services
        const servicesRes = await fetch('http://localhost:5000/api/customer/featured-services', { headers });
        if (servicesRes.ok) {
            const servicesData = await servicesRes.json();
            setFeaturedServices(servicesData);
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



  return (
    <div className="p-3 md:p-8 animate-fade-in max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
            title={`Welcome, ${user?.firstName || 'Customer'}!`}
            description="Here's an overview of your appointments."
        />
        <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#0B4F6C] hover:bg-[#093e54] text-white shadow-md transition-all hover:shadow-lg"
        >
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
        </Button>
      </div>

      {/* Featured Services Banner */}
      <ServiceBanner services={featuredServices} />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Today's Appointment Section */}
      {todaysAppointment && (
        <div className="bg-gradient-to-r from-[#0B4F6C] to-[#4DBDCC] rounded-xl shadow-lg p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Today's Appointment
                </h2>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {todaysAppointment.status.toUpperCase()}
                </span>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <p className="text-white/80 text-sm mb-1">Service</p>
                    <p className="font-semibold text-lg">{todaysAppointment.service}</p>
                </div>
                <div>
                    <p className="text-white/80 text-sm mb-1">Time</p>
                    <p className="font-semibold text-lg flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {todaysAppointment.time}
                    </p>
                </div>
                <div>
                    <p className="text-white/80 text-sm mb-1">Technician</p>
                    <p className="font-semibold text-lg">{todaysAppointment.technician}</p>
                </div>
            </div>
             <div className="mt-4 pt-4 border-t border-white/20 flex justify-end">
                <Button 
                    onClick={() => setIsViewDialogOpen(true)} 
                    variant="secondary"
                    className="bg-white text-[#0B4F6C] hover:bg-gray-100"
                >
                    View Details
                </Button>
            </div>
        </div>
      )}

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
            {recentUpdates.length > 0 ? (
              recentUpdates.map((update) => (
                <AppointmentUpdateCard 
                    key={update.id} 
                    update={update} 
                    onClick={() => {
                        setSelectedAppointment(update);
                        setIsViewDialogOpen(true);
                    }}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm md:text-base py-4">
                No recent updates available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Featured Services Section - New */}
      <ViewAppointmentDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={selectedAppointment || nextAppointment}
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

      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialServiceId={selectedAppointment?.service_id}
      />
    </div>
  );
}
