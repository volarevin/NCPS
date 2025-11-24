import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import {
  Calendar,
  TrendingUp,
  Users,
  Wrench,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  Award,
  Activity,
  Shield,
} from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Mock Data
const appointmentSummaryData = {
  total: 245,
  completed: 178,
  pending: 42,
  confirmed: 15,
  cancelled: 8,
  noShow: 2,
};

const monthlyAppointments = [
  { month: "Jan", appointments: 18, completed: 15, cancelled: 3 },
  { month: "Feb", appointments: 22, completed: 19, cancelled: 3 },
  { month: "Mar", appointments: 25, completed: 22, cancelled: 3 },
  { month: "Apr", appointments: 20, completed: 18, cancelled: 2 },
  { month: "May", appointments: 28, completed: 24, cancelled: 4 },
  { month: "Jun", appointments: 32, completed: 28, cancelled: 4 },
  { month: "Jul", appointments: 30, completed: 26, cancelled: 4 },
  { month: "Aug", appointments: 35, completed: 30, cancelled: 5 },
  { month: "Sep", appointments: 38, completed: 33, cancelled: 5 },
  { month: "Oct", appointments: 42, completed: 38, cancelled: 4 },
  { month: "Nov", appointments: 45, completed: 40, cancelled: 5 },
];

const appointmentStatusPieData = [
  { name: "Completed", value: 178, color: "#5DD37C" },
  { name: "Pending", value: 42, color: "#5B8FFF" },
  { name: "Confirmed", value: 15, color: "#7B9B7C" },
  { name: "Cancelled", value: 8, color: "#FF6B6B" },
  { name: "No-show", value: 2, color: "#FFA07A" },
];

const serviceTypeData = [
  { service: "CCTV Installation", bookings: 58, revenue: 232000 },
  { service: "Laptop Repair", bookings: 52, revenue: 130000 },
  { service: "CCTV Repair", bookings: 45, revenue: 157500 },
  { service: "LCD Replacement", bookings: 38, revenue: 152000 },
  { service: "CCTV Upgrade", bookings: 32, revenue: 160000 },
  { service: "PC Formatting", bookings: 20, revenue: 30000 },
];

const customerActivityData = {
  totalCustomers: 186,
  activeCustomers: 124,
  newThisMonth: 15,
  topCustomers: [
    { name: "Maria Santos", appointments: 8, totalSpent: 28500 },
    { name: "Juan Dela Cruz", appointments: 7, totalSpent: 24000 },
    { name: "Ana Reyes", appointments: 6, totalSpent: 22500 },
    { name: "Elena Garcia", appointments: 5, totalSpent: 18000 },
    { name: "Roberto Tan", appointments: 5, totalSpent: 16500 },
  ],
};

const monthlyNewCustomers = [
  { month: "Jan", customers: 12 },
  { month: "Feb", customers: 15 },
  { month: "Mar", customers: 18 },
  { month: "Apr", customers: 14 },
  { month: "May", customers: 16 },
  { month: "Jun", customers: 20 },
  { month: "Jul", customers: 17 },
  { month: "Aug", customers: 19 },
  { month: "Sep", customers: 22 },
  { month: "Oct", customers: 18 },
  { month: "Nov", customers: 15 },
];

const staffPerformanceData = [
  {
    name: "Juan Dela Cruz",
    totalHandled: 78,
    confirmed: 72,
    rating: 4.8,
  },
  {
    name: "Carlos Mendoza",
    totalHandled: 65,
    confirmed: 60,
    rating: 4.7,
  },
  {
    name: "Robert Santos",
    totalHandled: 52,
    confirmed: 48,
    rating: 4.6,
  },
  {
    name: "Mark Lopez",
    totalHandled: 45,
    confirmed: 42,
    rating: 4.5,
  },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 68500, paid: 65000, unpaid: 3500 },
  { month: "Feb", revenue: 75200, paid: 72000, unpaid: 3200 },
  { month: "Mar", revenue: 82300, paid: 80000, unpaid: 2300 },
  { month: "Apr", revenue: 71800, paid: 69500, unpaid: 2300 },
  { month: "May", revenue: 88400, paid: 86000, unpaid: 2400 },
  { month: "Jun", revenue: 95600, paid: 93000, unpaid: 2600 },
  { month: "Jul", revenue: 89200, paid: 87000, unpaid: 2200 },
  { month: "Aug", revenue: 98500, paid: 96000, unpaid: 2500 },
  { month: "Sep", revenue: 105800, paid: 103000, unpaid: 2800 },
  { month: "Oct", revenue: 112400, paid: 110000, unpaid: 2400 },
  { month: "Nov", revenue: 118900, paid: 116000, unpaid: 2900 },
];

const revenueData = {
  totalRevenue: 1006600,
  avgPerAppointment: 4109,
  totalPaid: 977500,
  totalUnpaid: 29100,
};

const peakHoursData = [
  { hour: "8 AM", bookings: 8 },
  { hour: "9 AM", bookings: 15 },
  { hour: "10 AM", bookings: 22 },
  { hour: "11 AM", bookings: 28 },
  { hour: "12 PM", bookings: 18 },
  { hour: "1 PM", bookings: 20 },
  { hour: "2 PM", bookings: 32 },
  { hour: "3 PM", bookings: 35 },
  { hour: "4 PM", bookings: 25 },
  { hour: "5 PM", bookings: 18 },
  { hour: "6 PM", bookings: 12 },
];

const peakDaysData = [
  { day: "Monday", bookings: 38 },
  { day: "Tuesday", bookings: 42 },
  { day: "Wednesday", bookings: 45 },
  { day: "Thursday", bookings: 40 },
  { day: "Friday", bookings: 48 },
  { day: "Saturday", bookings: 32 },
];

const cancellationReasons = [
  { reason: "Schedule conflict", count: 18, color: "#FF6B6B" },
  { reason: "Found another service", count: 12, color: "#FFA07A" },
  { reason: "Too expensive", count: 8, color: "#FFB347" },
  { reason: "Emergency", count: 6, color: "#FFCCCB" },
  { reason: "Other", count: 4, color: "#FFE4E1" },
];

export function Reports() {
  const [timeRange, setTimeRange] = useState("year");

  const quickStats = [
    {
      icon: Calendar,
      value: appointmentSummaryData.total.toString(),
      label: "Total Appointments",
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      icon: DollarSign,
      value: `₱${(revenueData.totalRevenue / 1000).toFixed(0)}K`,
      label: "Total Revenue",
      bgColor: "from-green-500 to-green-600",
    },
    {
      icon: Users,
      value: customerActivityData.totalCustomers.toString(),
      label: "Total Customers",
      bgColor: "from-purple-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      value: "89%",
      label: "Success Rate",
      bgColor: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl text-[#0B4F6C] font-bold">Reports</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Comprehensive analytics and insights for your business
          </p>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {quickStats.map((stat, index) => {
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

      {/* Time Range Filter */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border-2 border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <span className="text-sm text-gray-600">Time Range:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm shadow-sm ${
                timeRange === "month"
                  ? "bg-[#0B4F6C] text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange("quarter")}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm shadow-sm ${
                timeRange === "quarter"
                  ? "bg-[#0B4F6C] text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              This Quarter
            </button>
            <button
              onClick={() => setTimeRange("year")}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm shadow-sm ${
                timeRange === "year"
                  ? "bg-[#0B4F6C] text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              This Year
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="appointments" className="space-y-4 md:space-y-6">
        <TabsList className="bg-white p-1.5 md:p-2 rounded-xl border-2 border-gray-200 w-full overflow-x-auto flex gap-1 shadow-sm">
          <TabsTrigger value="appointments" className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all">
            Appointments
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all">
            Services
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all">
            Customers
          </TabsTrigger>
          <TabsTrigger value="technicians" className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all">
            Technicians
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all">
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Appointment Summary Tab */}
        <TabsContent value="appointments" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            <StatCard
              icon={<Calendar className="w-4 h-4 md:w-6 md:h-6" />}
              label="Total Appointments"
              value={appointmentSummaryData.total}
              color="#5B8FFF"
            />
            <StatCard
              icon={<CheckCircle className="w-4 h-4 md:w-6 md:h-6" />}
              label="Completed"
              value={appointmentSummaryData.completed}
              color="#5DD37C"
            />
            <StatCard
              icon={<Clock className="w-4 h-4 md:w-6 md:h-6" />}
              label="Pending"
              value={appointmentSummaryData.pending}
              color="#FFA07A"
            />
            <StatCard
              icon={<UserCheck className="w-4 h-4 md:w-6 md:h-6" />}
              label="Confirmed"
              value={appointmentSummaryData.confirmed}
              color="#7B9B7C"
            />
            <StatCard
              icon={<XCircle className="w-4 h-4 md:w-6 md:h-6" />}
              label="Cancelled"
              value={appointmentSummaryData.cancelled}
              color="#FF6B6B"
            />
            <StatCard
              icon={<AlertCircle className="w-4 h-4 md:w-6 md:h-6" />}
              label="No-show"
              value={appointmentSummaryData.noShow}
              color="#FFB347"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Monthly Appointments Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-gray-300">
              <h3 className="text-base md:text-xl text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C]" />
                <span className="text-sm md:text-base">Monthly Appointments Trend</span>
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="appointments"
                    stroke="#5B8FFF"
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#5DD37C"
                    strokeWidth={2}
                    name="Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="cancelled"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    name="Cancelled"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Appointment Status Pie Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-gray-300">
              <h3 className="text-base md:text-xl text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#0B4F6C]" />
                <span className="text-sm md:text-base">Appointment Status Distribution</span>
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={appointmentStatusPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentStatusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Service Type Report Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={<Wrench className="w-6 h-6" />}
              label="Total Services"
              value={serviceTypeData.length}
              color="#5B8FFF"
            />
            <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#5DD37C" }}
                >
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Most Requested</p>
                  <p className="text-gray-800">{serviceTypeData[0].service}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#FFA07A" }}
                >
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Least Requested</p>
                  <p className="text-gray-800">
                    {serviceTypeData[serviceTypeData.length - 1].service}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Type Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#0B4F6C]" />
              Service Type Bookings
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={serviceTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="service" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#5B8FFF" name="Number of Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Service Revenue */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4">Revenue by Service Type</h3>
            <div className="space-y-3">
              {serviceTypeData.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-gray-800">{service.service}</p>
                    <p className="text-sm text-gray-600">
                      {service.bookings} bookings
                    </p>
                  </div>
                  <p className="text-[#0B4F6C]">
                    ₱ {service.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Customer Activity Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Total Customers"
              value={customerActivityData.totalCustomers}
              color="#5B8FFF"
            />
            <StatCard
              icon={<UserCheck className="w-6 h-6" />}
              label="Active Customers"
              value={customerActivityData.activeCustomers}
              color="#5DD37C"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="New This Month"
              value={customerActivityData.newThisMonth}
              color="#7B9B7C"
            />
          </div>

          {/* Monthly New Customers */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0B4F6C]" />
              New Customer Registrations
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyNewCustomers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="customers"
                  fill="#5B8FFF"
                  name="New Customers"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0B4F6C]" />
              Top Customers
            </h3>
            <div className="space-y-3">
              {customerActivityData.topCustomers.map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{
                        backgroundColor:
                          index === 0
                            ? "#FFD700"
                            : index === 1
                            ? "#C0C0C0"
                            : index === 2
                            ? "#CD7F32"
                            : "#5B8FFF",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-800">{customer.name}</p>
                      <p className="text-sm text-gray-600">
                        {customer.appointments} appointments
                      </p>
                    </div>
                  </div>
                  <p className="text-[#0B4F6C]">
                    ₱ {customer.totalSpent.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Staff Performance Tab */}
        <TabsContent value="technicians" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#0B4F6C]" />
              Staff Performance Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalHandled" fill="#5B8FFF" name="Total Handled" />
                <Bar dataKey="confirmed" fill="#5DD37C" name="Confirmed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Staff Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffPerformanceData.map((staff, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border-2 border-gray-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#5B8FFF] flex items-center justify-center text-white">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-gray-800">{staff.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">
                          {staff.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl text-[#0B4F6C]">
                      {staff.totalHandled}
                    </p>
                    <p className="text-xs text-gray-600">Total Handled</p>
                  </div>
                  <div>
                    <p className="text-2xl text-[#5DD37C]">{staff.confirmed}</p>
                    <p className="text-xs text-gray-600">Confirmed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Revenue Report Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              label="Total Revenue"
              value={`₱${(revenueData.totalRevenue / 1000).toFixed(1)}K`}
              color="#5DD37C"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Avg per Appointment"
              value={`₱${revenueData.avgPerAppointment.toLocaleString()}`}
              color="#5B8FFF"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              label="Total Paid"
              value={`₱${(revenueData.totalPaid / 1000).toFixed(1)}K`}
              color="#7B9B7C"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              label="Total Unpaid"
              value={`₱${(revenueData.totalUnpaid / 1000).toFixed(1)}K`}
              color="#FFA07A"
            />
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#0B4F6C]" />
              Monthly Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="paid" fill="#5DD37C" name="Paid" stackId="a" />
                <Bar
                  dataKey="unpaid"
                  fill="#FFA07A"
                  name="Unpaid"
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Appointment Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          {/* Peak Hours */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0B4F6C]" />
              Peak Booking Hours
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#5B8FFF" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Days */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
              <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0B4F6C]" />
                Peak Booking Days
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakDaysData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#7B9B7C" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cancellation Reasons */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
              <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-[#0B4F6C]" />
                Cancellation Reasons
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cancellationReasons}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ reason, percent }) =>
                      `${reason}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {cancellationReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <div className="text-white">{icon}</div>
        </div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}