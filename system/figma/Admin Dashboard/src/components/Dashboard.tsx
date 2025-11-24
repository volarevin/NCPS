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
    value: "48",
    label: "Completed Jobs",
    bgColor: "#C8F0D4",
    iconBg: "#5DD37C",
  },
  {
    icon: UserCheck,
    value: "12",
    label: "Active Technicians",
    bgColor: "#E8D4FF",
    iconBg: "#9B66FF",
  },
  {
    icon: Users,
    value: "125",
    label: "Registered Customers",
    bgColor: "#FFD4B8",
    iconBg: "#FF9B66",
  },
];

export function Dashboard() {
  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-4xl text-[#0B4F6C] mb-2 font-bold">Welcome, Admin John!</h1>
        <p className="text-sm md:text-base text-gray-600">Here's an overview of today's activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-2 md:gap-4"
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Monthly Appointment Trends */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
          <h2 className="text-lg md:text-xl text-gray-800 mb-4 font-bold">
            Monthly Appointment Trends
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                domain={[0, 25]}
                ticks={[0, 5, 10, 15, 20, 25]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="appointments" fill="#5B8FFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Type Distribution */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
          <h2 className="text-lg md:text-xl text-gray-800 mb-4 font-bold">
            Service Type Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => (
                  <span className="text-xs md:text-sm text-gray-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity or Additional Info */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
        <h2 className="text-lg md:text-xl text-gray-800 mb-4 font-bold">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xl md:text-2xl text-[#0B4F6C] mb-1">89%</div>
            <div className="text-xs md:text-sm text-gray-600">Customer Satisfaction</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xl md:text-2xl text-[#0B4F6C] mb-1">3.2 days</div>
            <div className="text-xs md:text-sm text-gray-600">Avg. Completion Time</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xl md:text-2xl text-[#0B4F6C] mb-1">₱45,230</div>
            <div className="text-xs md:text-sm text-gray-600">Monthly Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}