import { useState } from "react";
import { 
  Search, 
  Plus, 
  UserCheck, 
  UserX, 
  Wrench, 
  Clock, 
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Edit,
  Star
} from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  specialty: string;
  status: "available" | "busy" | "offline";
  activeJobs: number;
  completedJobs: number;
  rating: number;
  avatar?: string;
}

const initialTechnicians: Technician[] = [
  {
    id: "1",
    name: "Carlos Mendez",
    phone: "+63 912 345 6789",
    email: "carlos.mendez@ncps.com",
    location: "Manila",
    specialty: "CCTV Installation",
    status: "available",
    activeJobs: 2,
    completedJobs: 48,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Maria Santos",
    phone: "+63 923 456 7890",
    email: "maria.santos@ncps.com",
    location: "Quezon City",
    specialty: "Computer Repair",
    status: "busy",
    activeJobs: 3,
    completedJobs: 62,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Juan Dela Cruz",
    phone: "+63 934 567 8901",
    email: "juan.delacruz@ncps.com",
    location: "Makati",
    specialty: "Hardware Installation",
    status: "available",
    activeJobs: 1,
    completedJobs: 35,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Anna Reyes",
    phone: "+63 945 678 9012",
    email: "anna.reyes@ncps.com",
    location: "Pasig",
    specialty: "Network Setup",
    status: "offline",
    activeJobs: 0,
    completedJobs: 41,
    rating: 4.6,
  },
  {
    id: "5",
    name: "Michael Torres",
    phone: "+63 956 789 0123",
    email: "michael.torres@ncps.com",
    location: "Taguig",
    specialty: "LCD Replacement",
    status: "busy",
    activeJobs: 2,
    completedJobs: 53,
    rating: 4.8,
  },
  {
    id: "6",
    name: "Sofia Garcia",
    phone: "+63 967 890 1234",
    email: "sofia.garcia@ncps.com",
    location: "Caloocan",
    specialty: "CCTV Repair",
    status: "available",
    activeJobs: 1,
    completedJobs: 29,
    rating: 4.5,
  },
];

export function Technicians() {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "busy" | "offline">("all");

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch = 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || tech.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const stats = [
    {
      icon: UserCheck,
      value: technicians.filter(t => t.status === "available").length.toString(),
      label: "Available",
      bgColor: "#C8F0D4",
      iconBg: "#5DD37C",
    },
    {
      icon: Wrench,
      value: technicians.filter(t => t.status === "busy").length.toString(),
      label: "On Job",
      bgColor: "#FFD9B8",
      iconBg: "#FFB366",
    },
    {
      icon: UserX,
      value: technicians.filter(t => t.status === "offline").length.toString(),
      label: "Offline",
      bgColor: "#E5E7EB",
      iconBg: "#9CA3AF",
    },
    {
      icon: CheckCircle,
      value: technicians.reduce((sum, t) => sum + t.completedJobs, 0).toString(),
      label: "Total Jobs Completed",
      bgColor: "#B8D4FF",
      iconBg: "#5B8FFF",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl text-[#0B4F6C] font-bold">Technicians</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage your technician team
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0B4F6C] hover:bg-[#084058] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base w-fit">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Add Technician
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-2xl p-3 md:p-6 flex flex-col md:flex-row items-center gap-2 md:gap-4"
              style={{ backgroundColor: stat.bgColor }}
            >
              <div
                className="rounded-xl p-2 md:p-3 text-white"
                style={{ backgroundColor: stat.iconBg }}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl md:text-2xl text-gray-700">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <Input
            type="text"
            placeholder="Search by name, specialty, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-2 border-gray-300 focus:border-[#0B4F6C] h-10 md:h-12 text-sm md:text-base"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base transition-colors ${
              filterStatus === "all"
                ? "bg-[#0B4F6C] text-white"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#0B4F6C]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("available")}
            className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base transition-colors ${
              filterStatus === "available"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500"
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilterStatus("busy")}
            className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base transition-colors ${
              filterStatus === "busy"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-500"
            }`}
          >
            Busy
          </button>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredTechnicians.map((tech) => (
          <div
            key={tech.id}
            className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200 hover:border-[#0B4F6C]"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {tech.avatar ? (
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0B4F6C] flex items-center justify-center text-white text-lg md:text-xl">
                    {tech.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
                <div>
                  <h3 className="text-base md:text-lg text-gray-800">{tech.name}</h3>
                  <Badge
                    className={`${getStatusColor(tech.status)} text-white border-none text-xs`}
                  >
                    {getStatusText(tech.status)}
                  </Badge>
                </div>
              </div>
              <button className="text-gray-400 hover:text-[#0B4F6C] transition-colors">
                <Edit className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Specialty */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-[#0B4F6C] mb-1">
                <Wrench className="w-4 h-4" />
                <span className="text-xs md:text-sm">Specialty</span>
              </div>
              <p className="text-sm md:text-base text-gray-700">{tech.specialty}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{tech.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{tech.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{tech.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  <span className="text-sm md:text-base text-gray-700">{tech.rating}</span>
                </div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-sm md:text-base text-gray-700">{tech.activeJobs}</span>
                </div>
                <div className="text-xs text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                  <span className="text-sm md:text-base text-gray-700">{tech.completedJobs}</span>
                </div>
                <div className="text-xs text-gray-500">Done</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTechnicians.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No technicians found matching your criteria
        </div>
      )}
    </div>
  );
}
