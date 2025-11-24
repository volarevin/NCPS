import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Appointments } from "./components/Appointments";
import { UserAccounts } from "./components/UserAccounts";
import { Reports } from "./components/Reports";
import { Technicians } from "./components/Technicians";
import { ServiceCard } from "./components/ServiceCard";
import { EditServiceDialog } from "./components/EditServiceDialog";
import { Menu, Settings, Wrench, ArrowUpCircle, Plus, X, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./components/ui/sheet";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  color: string;
}

const initialServices: Service[] = [
  {
    id: "1",
    name: "Laptop Repair",
    category: "Repair",
    description:
      "Professional laptop repair services including hardware and software troubleshooting, component replacement, and system optimization.",
    price: "₱ 2,500.00",
    color: "#FF9B66",
  },
  {
    id: "2",
    name: "CCTV Repair",
    category: "Repair",
    description:
      "Expert CCTV camera repair and maintenance services for residential and commercial security systems.",
    price: "₱ 3,500.00",
    color: "#5B8FFF",
  },
  {
    id: "3",
    name: "CCTV Upgrade",
    category: "Upgrade & Maintenance",
    description:
      "Upgrade your existing CCTV system with the latest technology, higher resolution cameras, and advanced features.",
    price: "₱ 5,000.00",
    color: "#5DD37C",
  },
  {
    id: "4",
    name: "LCD Replacement",
    category: "Repair",
    description:
      "High-quality LCD screen replacement services for laptops, monitors, and other devices.",
    price: "₱ 4,000.00",
    color: "#FF9B66",
  },
  {
    id: "5",
    name: "CCTV Installation",
    category: "Installation",
    description:
      "Professional installation of CCTV camera systems for homes and businesses. Our service includes camera mounting, wiring, and basic DVR/NVR setup to get your security system up and running.",
    price: "₱ 4,000.00",
    color: "#5B8FFF",
  },
];

const categories = ["All", "Installation", "Repair", "Upgrade & Maintenance"];

function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setDialogOpen(true);
  };

  const handleSaveService = (service: Service) => {
    if (selectedService) {
      // Edit existing service
      setServices(
        services.map((s) => (s.id === service.id ? service : s))
      );
    } else {
      // Add new service
      setServices([...services, service]);
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const getCategoryIcon = (category: string) => {
    if (category === "All") return <Menu className="w-6 h-6" />;
    if (category === "Installation") return <Settings className="w-6 h-6" />;
    if (category === "Repair") return <Wrench className="w-6 h-6" />;
    if (category === "Upgrade & Maintenance")
      return <ArrowUpCircle className="w-6 h-6" />;
    return <Menu className="w-6 h-6" />;
  };

  return (
    <div className="flex h-screen bg-[#B8D8D8]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#0B4F6C]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate to different sections of the admin dashboard
          </SheetDescription>
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={(page) => {
              setCurrentPage(page);
              setMobileMenuOpen(false);
            }} 
          />
        </SheetContent>
      </Sheet>

      <div className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-[#0B4F6C] text-white p-4 flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-white/10 rounded"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#0B4F6C] flex items-center justify-center overflow-hidden bg-[#4DBDCC] p-1">
              <img 
                src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
                alt="Security Camera"
                className="w-8 h-8"
              />
            </div>
            <span className="font-bold">NCPS</span>
          </div>
        </div>

        {currentPage === "Dashboard" && <Dashboard />}

        {currentPage === "Manage Services" && (
          <div className="p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl text-[#0B4F6C] font-bold mb-2">Manage Services</h1>
              <p className="text-sm md:text-base text-gray-600">Create, edit, and organize your service offerings</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Settings className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
                  <span className="text-xl md:text-2xl">{services.filter(s => s.category === "Installation").length}</span>
                </div>
                <p className="text-xs md:text-sm opacity-90">Installation</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Wrench className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
                  <span className="text-xl md:text-2xl">{services.filter(s => s.category === "Repair").length}</span>
                </div>
                <p className="text-xs md:text-sm opacity-90">Repair</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
                  <span className="text-xl md:text-2xl">{services.filter(s => s.category === "Upgrade & Maintenance").length}</span>
                </div>
                <p className="text-xs md:text-sm opacity-90">Upgrade & Maint.</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Menu className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
                  <span className="text-xl md:text-2xl">{services.length}</span>
                </div>
                <p className="text-xs md:text-sm opacity-90">Total Services</p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="bg-white rounded-xl p-3 md:p-4 mb-6 shadow-sm border-2 border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <span className="text-sm text-gray-600">Filter by:</span>
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm shadow-sm ${
                        selectedCategory === category
                          ? "bg-[#0B4F6C] text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                        {getCategoryIcon(category)}
                      </span>
                      <span>{category}</span>
                    </button>
                  ))}
                </div>

                {/* Add Service Button */}
                <button
                  onClick={handleAddService}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="group bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#0B4F6C] transform hover:-translate-y-1"
                >
                  {/* Service Icon */}
                  <div 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 text-white shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.category === "Installation" && <Settings className="w-7 h-7 md:w-8 md:h-8" />}
                    {service.category === "Repair" && <Wrench className="w-7 h-7 md:w-8 md:h-8" />}
                    {service.category === "Upgrade & Maintenance" && <Sparkles className="w-7 h-7 md:w-8 md:h-8" />}
                  </div>

                  {/* Service Name */}
                  <h3 className="text-base md:text-lg text-gray-800 mb-2 group-hover:text-[#0B4F6C] transition-colors">
                    {service.name}
                  </h3>

                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="text-xs px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: service.color }}
                    >
                      {service.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-lg md:text-xl text-[#0B4F6C]">
                      {service.price}
                    </span>
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to edit →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Menu className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">No services found</p>
                <p className="text-gray-400 text-sm">Try selecting a different category or add a new service</p>
              </div>
            )}
          </div>
        )}

        {currentPage === "Appointments" && <Appointments />}

        {currentPage === "Technicians" && <Technicians />}

        {currentPage === "User Account" && <UserAccounts />}

        {currentPage === "Reports" && <Reports />}
      </div>

      {/* Edit Service Dialog */}
      <EditServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={selectedService}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />
    </div>
  );
}

export default App;