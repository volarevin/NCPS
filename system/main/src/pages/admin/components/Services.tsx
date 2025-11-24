import { PageHeader } from "./PageHeader";
import { useState } from "react";
import { Settings, Wrench, ArrowUpCircle, Plus, Menu, Sparkles } from "lucide-react";
import { EditServiceDialog } from "./EditServiceDialog";

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

export function Services() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Manage Services" 
        description="Create, edit, and organize your service offerings."
        action={
          <button
            onClick={handleAddService}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B4F6C] text-white hover:bg-[#093e54] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        }
      />

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
