import { useState } from 'react';
import { CustomerSidebar } from './components/CustomerSidebar';
import { CustomerDashboard } from './components/CustomerDashboard';
import { CustomerAppointments } from './components/CustomerAppointments';
import { CustomerProfile } from './components/CustomerProfile';
import { MobileHeader } from './components/MobileHeader';
import { MobileSidebar } from './components/MobileSidebar';

export type Page = 'dashboard' | 'appointments' | 'profile';

export default function CustomerPage() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <CustomerSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40">
        <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <>
          {/* Dimmed Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Sidebar */}
          <MobileSidebar 
            currentPage={currentPage} 
            onNavigate={(page) => {
              setCurrentPage(page);
              setIsMobileSidebarOpen(false);
            }}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        </>
      )}
      
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        {currentPage === 'dashboard' && <CustomerDashboard />}
        {currentPage === 'appointments' && <CustomerAppointments />}
        {currentPage === 'profile' && <CustomerProfile />}
      </main>
    </div>
  );
}
