import { useState } from "react";
import { UserCard } from "./UserCard";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { Search, Users, Shield, UserPlus, UserCheck, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

interface UserData {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: "customer" | "staff" | "technician";
  avatar?: string;
  joinedDate: string;
  activityLogs: ActivityLog[];
}

const initialUsers: UserData[] = [
  {
    id: "1",
    fullName: "Maria Santos",
    username: "maria.santos",
    email: "maria.santos@email.com",
    phone: "+63 912 345 6789",
    role: "customer",
    joinedDate: "Jan 15, 2024",
    activityLogs: [
      {
        id: "1",
        action: "Service Booking",
        timestamp: "Nov 21, 2025 - 10:30 AM",
        details: "Booked CCTV Installation service for Nov 25, 2025",
      },
      {
        id: "2",
        action: "Profile Update",
        timestamp: "Nov 20, 2025 - 3:15 PM",
        details: "Updated phone number",
      },
      {
        id: "3",
        action: "Account Created",
        timestamp: "Jan 15, 2024 - 9:00 AM",
        details: "Registered new account",
      },
    ],
  },
  {
    id: "2",
    fullName: "Juan Dela Cruz",
    username: "juan.dc",
    email: "juan.dc@email.com",
    phone: "+63 923 456 7890",
    role: "technician",
    joinedDate: "Feb 10, 2024",
    activityLogs: [
      {
        id: "1",
        action: "Job Completed",
        timestamp: "Nov 21, 2025 - 2:00 PM",
        details: "Completed repair for Ticket #1234",
      },
    ],
  },
  {
    id: "3",
    fullName: "Admin Staff",
    username: "admin.staff",
    email: "admin@ncps.com",
    phone: "+63 934 567 8901",
    role: "staff",
    joinedDate: "Jan 1, 2024",
    activityLogs: [],
  },
];

export function UserAccounts() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Customers",
      value: users.filter((u) => u.role === "customer").length,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      label: "Technicians",
      value: users.filter((u) => u.role === "technician").length,
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      label: "Active Now",
      value: 12,
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#0B4F6C]">User Accounts</h2>
        <button className="bg-[#0B4F6C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#093e54] transition-colors">
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, email, or username..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "customer", "technician", "staff"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${
                roleFilter === role
                  ? "bg-[#0B4F6C] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            {...user}
            onClick={() => handleViewDetails(user)}
          />
        ))}
      </div>

      <UserDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        user={selectedUser}
        onSave={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setIsDetailsOpen(false);
        }}
        onPromote={(id) => console.log("Promote", id)}
        onDemote={(id) => console.log("Demote", id)}
      />
    </div>
  );
}
