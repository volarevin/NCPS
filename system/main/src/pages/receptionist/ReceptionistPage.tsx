import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AppointmentSchedule, Appointment } from './components/AppointmentSchedule';
import { Dashboard } from './components/Dashboard';
import { MyAccount } from './components/MyAccount';
import { Toaster } from '../../components/ui/sonner';
import { MobileHeader } from './components/MobileHeader';

export default function ReceptionistPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    // You might want to redirect to login page here
    window.location.href = '/';
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCurrentPage('appointments');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#B5D9D9] to-[#9BC7C7] overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className={`flex-1 overflow-auto transition-all duration-300 ${mobileMenuOpen ? 'lg:brightness-100 brightness-50' : ''}`}>
          {currentPage === 'dashboard' && <Dashboard onAppointmentClick={handleAppointmentClick} />}
          {currentPage === 'appointments' && (
            <AppointmentSchedule 
              selectedAppointmentFromDashboard={selectedAppointment}
              onClearSelection={() => setSelectedAppointment(null)}
            />
          )}
          {currentPage === 'account' && <MyAccount />}
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
}
