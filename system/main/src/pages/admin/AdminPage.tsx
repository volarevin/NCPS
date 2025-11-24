import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Appointments } from "./components/Appointments";
import { Services } from "./components/Services";
import { Technicians } from "./components/Technicians";
import { UserAccounts } from "./components/UserAccounts";
import { Reports } from "./components/Reports";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Appointments":
        return <Appointments />;
      case "Manage Services":
        return <Services />;
      case "Technicians":
        return <Technicians />;
      case "User Account":
        return <UserAccounts />;
      case "Reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar currentPage={activeTab} onNavigate={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
