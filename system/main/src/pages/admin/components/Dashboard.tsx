import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Wrench, CheckCircle, Users, UserCheck } from "lucide-react";

const monthlyData = [
  { month: "Jan", appointments: 11 },
  { month: "Feb", appointments: 15 },
  { month: "Mar", appointments: 18 },
  { month: "Apr", appointments: 14 },
  { month: "May", appointments: 12 },
  { month: "Jun", appointments: 16 },
  { month: "Jul", appointments: 15 },
  { month: "Aug", appointments: 20 },
  { month: "Sep", appointments: 17 },
  { month: "Oct", appointments: 13 },
];

const serviceDistribution = [
  { name: "Computer Repair", value: 45, color: "#5B8FFF" },
  { name: "Hardware Installation", value: 30, color: "#FFB366" },
  { name: "Software Troubleshooting", value: 15, color: "#5DD37C" },
  { name: "Other Services", value: 10, color: "#FF6B6B" },
];

const stats = [
  {
    icon: Calendar,
    value: "15",
    label: "Total Appoints",
    bgColor: "#B8D4FF",
    iconBg: "#5B8FFF",
  },
  {
    icon: Wrench,
    value: "5",
    label: "Services in Progress",
    bgColor: "#FFD9B8",
    iconBg: "#FFB366",
  },
  {
    icon: CheckCircle,
    value: "120",
    label: "Completed Services",
    bgColor: "#C1EAC5",
    iconBg: "#5DD37C",
  },
  {
    icon: Users,
    value: "8",
    label: "Active Technicians",
    bgColor: "#E0E0E0",
    iconBg: "#757575",
  },
];

const recentActivities = [
  {
    user: "Juan Dela Cruz",
    action: "Booked an appointment",
    time: "2 mins ago",
    icon: Calendar,
    color: "#5B8FFF",
  },
  {
    user: "Tech. Mario",
    action: "Completed a repair",
    time: "15 mins ago",
    icon: CheckCircle,
    color: "#5DD37C",
  },
  {
    user: "Maria Clara",
    action: "Registered new account",
    time: "1 hour ago",
    icon: UserCheck,
    color: "#FFB366",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0B4F6C]">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center space-x-4"
          >
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon
                className="w-6 h-6"
                style={{ color: stat.iconBg }}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Appointments Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Appointments
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="appointments"
                  fill="#5B8FFF"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className="p-2 rounded-full mt-1"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  <activity.icon
                    className="w-4 h-4"
                    style={{ color: activity.color }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Service Distribution
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
