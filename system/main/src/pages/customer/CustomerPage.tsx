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
    <div className="flex h-screen bg-[#B8D4D8] overflow-hidden">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <CustomerSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <>
          {/* Dimmed Overlay */}
          <div 
            className="fixed inset-0 bg-[#0B4F6C]/40 z-40 md:hidden"
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
      
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        {currentPage === 'dashboard' && <CustomerDashboard />}
        {currentPage === 'appointments' && <CustomerAppointments />}
        {currentPage === 'profile' && <CustomerProfile />}
      </main>
    </div>
  );
}
