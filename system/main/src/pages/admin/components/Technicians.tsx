import { useState } from "react";
import { 
  Search, 
  Plus, 
  Phone,
  Mail,
  MapPin,
  Edit,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
    activeJobs: 5,
    completedJobs: 120,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Juan Dela Cruz",
    phone: "+63 934 567 8901",
    email: "juan.delacruz@ncps.com",
    location: "Makati",
    specialty: "Network Setup",
    status: "offline",
    activeJobs: 0,
    completedJobs: 35,
    rating: 4.5,
  },
  {
    id: "4",
    name: "Ana Reyes",
    phone: "+63 945 678 9012",
    email: "ana.reyes@ncps.com",
    location: "Taguig",
    specialty: "Software Troubleshooting",
    status: "available",
    activeJobs: 1,
    completedJobs: 62,
    rating: 4.7,
  },
];

export function Technicians() {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tech.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "busy":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#0B4F6C]">Technicians</h2>
        <button className="bg-[#0B4F6C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#093e54] transition-colors">
          <Plus className="w-4 h-4" />
          Add Technician
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search technician or specialty..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "available", "busy", "offline"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${
                statusFilter === status
                  ? "bg-[#0B4F6C] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnicians.map((tech) => (
          <div
            key={tech.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E6F0F4] flex items-center justify-center text-[#0B4F6C] font-bold text-xl">
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{tech.name}</h3>
                    <p className="text-sm text-[#0B4F6C]">{tech.specialty}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(tech.status)}>
                  {tech.status}
                </Badge>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {tech.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {tech.email}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {tech.location}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-4">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {tech.activeJobs}
                  </p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {tech.completedJobs}
                  </p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-bold text-gray-800">
                      {tech.rating}
                    </span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-100">
              <button className="text-sm text-gray-600 hover:text-[#0B4F6C] font-medium">
                View Profile
              </button>
              <button className="p-2 text-gray-400 hover:text-[#0B4F6C] hover:bg-white rounded-full transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
