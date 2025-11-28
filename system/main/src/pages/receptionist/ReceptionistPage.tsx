import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AppointmentSchedule, Appointment } from './components/AppointmentSchedule';
import { Dashboard } from './components/Dashboard';
import { MyAccount } from './components/MyAccount';
import { MobileHeader } from './components/MobileHeader';

export default function ReceptionistPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    document.title = "Receptionist Dashboard";
  }, []);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCurrentPage('appointments');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ${mobileMenuOpen ? 'lg:brightness-100 brightness-50' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && <Dashboard onAppointmentClick={handleAppointmentClick} />}
            {currentPage === 'appointments' && (
              <AppointmentSchedule 
                selectedAppointmentFromDashboard={selectedAppointment}
                onClearSelection={() => setSelectedAppointment(null)}
              />
            )}
            {currentPage === 'account' && <MyAccount />}
          </div>
        </main>
      </div>
    </div>
  );
}
