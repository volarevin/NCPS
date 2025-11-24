import { useState } from "react";
import { UserCard } from "./UserCard";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { Search, Users, Shield, UserPlus, UserCheck, Activity } from "lucide-react";
import { Input } from "./ui/input";

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
        details: "Customer account created successfully",
      },
    ],
  },
  {
    id: "2",
    fullName: "Juan Dela Cruz",
    username: "juan.cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 917 234 5678",
    role: "staff",
    joinedDate: "Mar 10, 2024",
    activityLogs: [
      {
        id: "1",
        action: "Service Completed",
        timestamp: "Nov 21, 2025 - 2:45 PM",
        details: "Completed Laptop Repair service for customer #4521",
      },
      {
        id: "2",
        action: "Role Changed",
        timestamp: "Oct 5, 2025 - 11:20 AM",
        details: "Promoted from Customer to Staff",
      },
      {
        id: "3",
        action: "Service Assigned",
        timestamp: "Oct 1, 2025 - 9:30 AM",
        details: "Assigned to CCTV Upgrade service",
      },
    ],
  },
  {
    id: "3",
    fullName: "Ana Reyes",
    username: "ana.reyes",
    email: "ana.reyes@email.com",
    phone: "+63 905 876 5432",
    role: "customer",
    joinedDate: "Jul 22, 2024",
    activityLogs: [
      {
        id: "1",
        action: "Payment Completed",
        timestamp: "Nov 18, 2025 - 4:20 PM",
        details: "Paid ₱2,500.00 for Laptop Repair service",
      },
      {
        id: "2",
        action: "Service Booking",
        timestamp: "Nov 15, 2025 - 1:00 PM",
        details: "Booked Laptop Repair service",
      },
    ],
  },
  {
    id: "4",
    fullName: "Carlos Mendoza",
    username: "carlos.m",
    email: "carlos.mendoza@email.com",
    phone: "+63 920 111 2233",
    role: "staff",
    joinedDate: "Feb 5, 2024",
    activityLogs: [
      {
        id: "1",
        action: "Service Completed",
        timestamp: "Nov 19, 2025 - 5:00 PM",
        details: "Completed CCTV Installation at residential property",
      },
      {
        id: "2",
        action: "Training Completed",
        timestamp: "Sep 12, 2025 - 3:00 PM",
        details: "Completed advanced CCTV systems training",
      },
    ],
  },
  {
    id: "5",
    fullName: "Elena Garcia",
    username: "elena.garcia",
    email: "elena.garcia@email.com",
    phone: "+63 918 999 8877",
    role: "customer",
    joinedDate: "Aug 30, 2024",
    activityLogs: [
      {
        id: "1",
        action: "Review Posted",
        timestamp: "Nov 10, 2025 - 2:30 PM",
        details: "Posted 5-star review for LCD Replacement service",
      },
      {
        id: "2",
        action: "Service Completed",
        timestamp: "Nov 8, 2025 - 11:00 AM",
        details: "LCD Replacement service completed",
      },
    ],
  },
  {
    id: "6",
    fullName: "Roberto Tan",
    username: "roberto.tan",
    email: "roberto.tan@email.com",
    phone: "+63 932 555 4444",
    role: "customer",
    joinedDate: "Sep 14, 2024",
    activityLogs: [
      {
        id: "1",
        action: "Quote Requested",
        timestamp: "Nov 20, 2025 - 10:00 AM",
        details: "Requested quote for CCTV Upgrade service",
      },
    ],
  },
];

export function UserAccounts() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "staff">(
    "all"
  );

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleSaveUser = (updatedUser: UserData) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setSelectedUser(updatedUser);
  };

  const handlePromote = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const updatedUser = { ...u, role: "staff" as const };
          setSelectedUser(updatedUser);
          return updatedUser;
        }
        return u;
      })
    );
  };

  const handleDemote = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const updatedUser = { ...u, role: "customer" as const };
          setSelectedUser(updatedUser);
          return updatedUser;
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const customerCount = users.filter((u) => u.role === "customer").length;
  const staffCount = users.filter((u) => u.role === "staff").length;

  const stats = [
    {
      icon: Users,
      value: users.length.toString(),
      label: "Total Users",
      bgColor: "from-purple-500 to-purple-600",
    },
    {
      icon: UserCheck,
      value: customerCount.toString(),
      label: "Customers",
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      icon: Shield,
      value: staffCount.toString(),
      label: "Staff Members",
      bgColor: "from-green-500 to-green-600",
    },
    {
      icon: Activity,
      value: users.reduce((sum, u) => sum + u.activityLogs.length, 0).toString(),
      label: "Total Activities",
      bgColor: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl text-[#0B4F6C] font-bold">
            User Accounts
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage customer and staff accounts</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all shadow-md hover:shadow-lg text-sm md:text-base w-fit">
          <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
          Add New User
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-4 text-white`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
                <span className="text-xl md:text-2xl">{stat.value}</span>
              </div>
              <p className="text-xs md:text-sm opacity-90">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border-2 border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <Input
              type="text"
              placeholder="Search by name, username, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 h-10 md:h-12 bg-gray-50 border-gray-200 focus:border-[#0B4F6C] text-sm md:text-base"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm shadow-sm ${
                roleFilter === "all"
                  ? "bg-[#0B4F6C] text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter("customer")}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm shadow-sm ${
                roleFilter === "customer"
                  ? "bg-[#0B4F6C] text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="hidden sm:inline">Customers ({customerCount})</span>
              <span className="sm:hidden">Customers</span>
            </button>
            <button
              onClick={() => setRoleFilter("staff")}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm shadow-sm ${
                roleFilter === "staff"
                  ? "bg-[#0B4F6C] text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="hidden sm:inline">Staff ({staffCount})</span>
              <span className="sm:hidden">Staff</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            fullName={user.fullName}
            username={user.username}
            email={user.email}
            phone={user.phone}
            role={user.role}
            avatar={user.avatar}
            onClick={() => handleUserClick(user)}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No users found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* User Details Dialog */}
      <UserDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSave={handleSaveUser}
        onPromote={handlePromote}
        onDemote={handleDemote}
      />
    </div>
  );
}