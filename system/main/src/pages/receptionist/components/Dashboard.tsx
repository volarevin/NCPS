import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Users,
  Activity,
  TrendingUp,
  Check,
  X,
  Settings,
  Wrench,
  Sparkles,
  Box,
  Menu,
  Star
} from 'lucide-react';
import { toast } from "sonner";
import { AddAppointmentDialog } from './AddAppointmentDialog';
import { AppointmentDetailsDialog } from './AppointmentDetailsDialog';
import { StatusChangeDialog } from './StatusChangeDialog';
import { StatCard } from './StatCard';
import { Appointment } from './AppointmentSchedule';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PageHeader } from './PageHeader';

// Icon map for dynamic rendering
const iconMap: Record<string, any> = {
  Settings,
  Wrench,
  Sparkles,
  Box,
  Menu
};

interface DashboardProps {
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function Dashboard({ onAppointmentClick: propOnAppointmentClick }: DashboardProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    confirmed: 0,
    completed: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [serviceSummary, setServiceSummary] = useState<{
    name: string, 
    count: number, 
    icon: string, 
    color: string,
    services: { name: string, count: number }[]
  }[]>([]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    type: 'reject' | 'cancel';
    appointmentId?: string;
  }>({ open: false, type: 'cancel' });

  const [selectedCategory, setSelectedCategory] = useState<{
    name: string, 
    count: number, 
    icon: string, 
    color: string,
    services: { name: string, count: number }[]
  } | null>(null);

  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:5000/api/receptionist/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const data = await response.json();
      
      const normalize = (appt: any) => ({
          ...appt,
          status: appt.status.trim().toLowerCase().replace(/[ _]/g, '-')
      });

      if (data.stats) setStats(data.stats);
      if (data.todayAppointments) setTodayAppointments(data.todayAppointments.map(normalize));
      if (data.pendingAppointments) setPendingAppointments(data.pendingAppointments.map(normalize));
      if (data.serviceSummary) setServiceSummary(data.serviceSummary);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onAppointmentClick = (appointment: Appointment) => {
    // Always open details dialog instead of redirecting
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleStatusUpdate = async (id: string, status: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (status === 'rejected') {
      setStatusDialog({ open: true, type: 'reject', appointmentId: id });
      return;
    }
    
    if (status === 'cancelled') {
      setStatusDialog({ open: true, type: 'cancel', appointmentId: id });
      return;
    }

    // For quick approve, we now need to open the details dialog to assign a technician
    if (status === 'confirmed') {
      const appointment = pendingAppointments.find(a => a.id === id) || todayAppointments.find(a => a.id === id);
      if (appointment) {
        setSelectedAppointment(appointment);
        setIsDetailsOpen(true);
      }
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      let backendStatus = status.charAt(0).toUpperCase() + status.slice(1);
      if (status === 'in-progress') backendStatus = 'In Progress';

      await fetch(`http://localhost:5000/api/receptionist/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: backendStatus })
      });
      
      toast.success(`Appointment ${status}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleStatusConfirm = async (reason: string, category: string) => {
    if (!statusDialog.appointmentId) return;

    try {
      const token = sessionStorage.getItem('token');
      const status = statusDialog.type === 'reject' ? 'rejected' : 'cancelled';
      
      await fetch(`http://localhost:5000/api/receptionist/appointments/${statusDialog.appointmentId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status, reason, category })
      });
      
      toast.success(`Appointment ${status}`);
      setStatusDialog({ ...statusDialog, open: false });
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-orange-500';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-400';
      case 'confirmed':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

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
          value={stats.in_progress} 
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
              <div className="space-y-2 max-h-60 overflow-y-auto overflow-x-hidden">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => onAppointmentClick(appointment)}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-[#E5F4F5] to-white rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#0B4F6C] group-hover:text-[#4DBDCC] transition-colors truncate">{appointment.clientName}</p>
                      <p className="text-xs text-gray-600 truncate">{appointment.service}</p>
                      {appointment.status === 'completed' && appointment.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-600">{appointment.rating}/5</span>
                        </div>
                      )}
                      {appointment.status === 'cancelled' && appointment.cancellationCategory && (
                        <p className="text-xs text-red-500 mt-1 truncate">
                          Reason: {appointment.cancellationCategory}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-2 flex-shrink-0 flex flex-col items-end gap-1">
                      <p className="text-xs text-[#0B4F6C]">{appointment.time}</p>
                      <div className="flex items-center gap-1">
                        <Badge className={`${getStatusColor(appointment.status)} text-white text-xs`}>
                          {appointment.status === 'in-progress' ? 'In Progress' : appointment.status}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => handleStatusUpdate(appointment.id, 'cancelled', e)}
                          title="Cancel Appointment"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Appointments */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4DBDCC]">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base text-[#0B4F6C] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#F97316]" />
              Pending Appointments
            </CardTitle>
            <CardDescription className="text-xs">
              Waiting for approval
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            {pendingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-3 text-xs sm:text-sm">No pending appointments</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto overflow-x-hidden">
                {pendingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => onAppointmentClick(appointment)}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-[#FFF7ED] to-white rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group border border-orange-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#0B4F6C] font-medium truncate">{appointment.clientName}</p>
                      <p className="text-xs text-gray-600 truncate">{appointment.service}</p>
                      <p className="text-xs text-gray-500">{appointment.date} • {appointment.time}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={(e) => handleStatusUpdate(appointment.id, 'confirmed', e)}
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => handleStatusUpdate(appointment.id, 'rejected', e)}
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {serviceSummary
              .sort((a, b) => {
                if (a.name === 'Others') return 1;
                if (b.name === 'Others') return -1;
                return 0;
              })
              .map((category) => {
              const IconComponent = iconMap[category.icon] || Box;
              return (
                <div 
                  key={category.name} 
                  onClick={() => setSelectedCategory(category)}
                  className="bg-white rounded-lg p-3 sm:p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-[#4DBDCC]"
                  style={{ backgroundColor: `${category.color}15` }} // 10% opacity background
                >
                  <div 
                    className="mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: category.color }}>
                    {category.count}
                  </div>
                  <div className="text-xs text-gray-600 font-medium line-clamp-2">{category.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AddAppointmentDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAddAppointment={(newAppointment) => {
          console.log('Add appointment', newAppointment);
          fetchDashboardData();
        }}
      />

      {selectedAppointment && (
        <AppointmentDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          appointment={selectedAppointment}
          onStatusUpdate={async (id, status, technicianId) => {
            // Handle status update from dialog
            try {
                const token = sessionStorage.getItem('token');
                let backendStatus = status.charAt(0).toUpperCase() + status.slice(1);
                if (status === 'in-progress') backendStatus = 'In Progress';

                const body: any = { status: backendStatus };
                if (status === 'confirmed' && technicianId) {
                    body.technicianId = technicianId;
                }
                
                await fetch(`http://localhost:5000/api/receptionist/appointments/${id}/status`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(body)
                });
                
                toast.success(`Appointment ${status}`);
                setIsDetailsOpen(false);
                fetchDashboardData();
            } catch (error) {
                console.error("Error updating status:", error);
                toast.error("Failed to update status");
            }
          }}
          onUpdateDetails={async (id, date, time, technicianId) => {
            try {
              const token = sessionStorage.getItem('token');
              await fetch(`http://localhost:5000/api/receptionist/appointments/${id}/details`, {
                method: 'PUT',
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date, time, technicianId })
              });
              toast.success("Appointment details updated");
              fetchDashboardData();
            } catch (error) {
              console.error("Error updating details:", error);
              toast.error("Failed to update details");
            }
          }}
        />
      )}

      <StatusChangeDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog({ ...statusDialog, open })}
        title={statusDialog.type === 'reject' ? "Reject Appointment" : "Cancel Appointment"}
        description={statusDialog.type === 'reject' 
          ? "Please provide a reason for rejecting this appointment." 
          : "Please provide a reason for cancelling this appointment."}
        actionLabel={statusDialog.type === 'reject' ? "Reject Appointment" : "Cancel Appointment"}
        onConfirm={handleStatusConfirm}
        variant="destructive"
        role="staff"
      />

      <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0B4F6C]">
              {selectedCategory && (() => {
                const Icon = iconMap[selectedCategory.icon] || Box;
                return <Icon className="w-5 h-5" style={{ color: selectedCategory.color }} />;
              })()}
              {selectedCategory?.name} Services
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              {selectedCategory?.services.map((service, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="font-medium text-gray-700">{service.name}</span>
                  <Badge variant="secondary" className="bg-white border border-gray-200 text-gray-600">
                    {service.count} request{service.count !== 1 ? 's' : ''}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
