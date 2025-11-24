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
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  { month: "Aug", appointments: 35, completed: 31, cancelled: 4 },
  { month: "Sep", appointments: 28, completed: 25, cancelled: 3 },
  { month: "Oct", appointments: 25, completed: 22, cancelled: 3 },
];

const servicePerformanceData = [
  { name: "CCTV Installation", requests: 85, revenue: 127500, rating: 4.8 },
  { name: "Computer Repair", requests: 120, revenue: 60000, rating: 4.7 },
  { name: "Network Setup", requests: 45, revenue: 67500, rating: 4.9 },
  { name: "Software Support", requests: 65, revenue: 32500, rating: 4.6 },
  { name: "Printer Repair", requests: 30, revenue: 15000, rating: 4.5 },
];

const staffPerformanceData = [
  {
    name: "Carlos Mendez",
    role: "Technician",
    totalHandled: 48,
    confirmed: 45,
    rating: 4.8,
    efficiency: 94,
  },
  {
    name: "Maria Santos",
    role: "Technician",
    totalHandled: 52,
    confirmed: 49,
    rating: 4.9,
    efficiency: 96,
  },
  {
    name: "Juan Dela Cruz",
    role: "Technician",
    totalHandled: 35,
    confirmed: 32,
    rating: 4.5,
    efficiency: 91,
  },
  {
    name: "Ana Reyes",
    role: "Technician",
    totalHandled: 62,
    confirmed: 58,
    rating: 4.7,
    efficiency: 93,
  },
];

const revenueData = {
  totalRevenue: 302500,
  avgPerAppointment: 1234,
  totalPaid: 285000,
  totalUnpaid: 17500,
};

const monthlyRevenue = [
  { month: "Jan", paid: 25000, unpaid: 2000 },
  { month: "Feb", paid: 28000, unpaid: 1500 },
  { month: "Mar", paid: 32000, unpaid: 2500 },
  { month: "Apr", paid: 29000, unpaid: 1000 },
  { month: "May", paid: 35000, unpaid: 3000 },
  { month: "Jun", paid: 42000, unpaid: 2000 },
  { month: "Jul", paid: 38000, unpaid: 1500 },
  { month: "Aug", paid: 45000, unpaid: 2500 },
  { month: "Sep", paid: 36000, unpaid: 1000 },
  { month: "Oct", paid: 32000, unpaid: 500 },
];

const peakHoursData = [
  { hour: "8 AM", bookings: 12 },
  { hour: "9 AM", bookings: 25 },
  { hour: "10 AM", bookings: 35 },
  { hour: "11 AM", bookings: 28 },
  { hour: "1 PM", bookings: 30 },
  { hour: "2 PM", bookings: 32 },
  { hour: "3 PM", bookings: 25 },
  { hour: "4 PM", bookings: 18 },
  { hour: "5 PM", bookings: 10 },
];

const peakDaysData = [
  { day: "Mon", bookings: 45 },
  { day: "Tue", bookings: 38 },
  { day: "Wed", bookings: 42 },
  { day: "Thu", bookings: 40 },
  { day: "Fri", bookings: 55 },
  { day: "Sat", bookings: 65 },
  { day: "Sun", bookings: 25 },
];

const cancellationReasons = [
  { reason: "Client Reschedule", count: 15, color: "#5B8FFF" },
  { reason: "Technician Unavailable", count: 8, color: "#FFB366" },
  { reason: "Service Not Needed", count: 5, color: "#5DD37C" },
  { reason: "Price Issue", count: 3, color: "#FF6B6B" },
  { reason: "Other", count: 2, color: "#A0A0A0" },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#0B4F6C]">Reports & Analytics</h2>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F6C]">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
          <button className="bg-[#0B4F6C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#093e54] transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-white p-1 rounded-xl border border-gray-200 mb-6">
          <TabsTrigger
            value="appointments"
            className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white rounded-lg"
          >
            Appointments
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white rounded-lg"
          >
            Services
          </TabsTrigger>
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white rounded-lg"
          >
            Revenue
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="data-[state=active]:bg-[#0B4F6C] data-[state=active]:text-white rounded-lg"
          >
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Appointments Report Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Calendar className="w-6 h-6" />}
              label="Total Appointments"
              value={appointmentSummaryData.total}
              color="#5B8FFF"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              label="Completed"
              value={appointmentSummaryData.completed}
              color="#5DD37C"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              label="Pending"
              value={appointmentSummaryData.pending}
              color="#FFB366"
            />
            <StatCard
              icon={<XCircle className="w-6 h-6" />}
              label="Cancelled"
              value={appointmentSummaryData.cancelled}
              color="#FF6B6B"
            />
          </div>

          {/* Monthly Appointments Chart */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0B4F6C]" />
              Monthly Appointment Trends
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyAppointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
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
        </TabsContent>

        {/* Services & Staff Report Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Popularity */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
              <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#0B4F6C]" />
                Service Popularity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  layout="vertical"
                  data={servicePerformanceData}
                  margin={{ left: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#5B8FFF" name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Service Ratings */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
              <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0B4F6C]" />
                Service Ratings
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  layout="vertical"
                  data={servicePerformanceData}
                  margin={{ left: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#FFB366" name="Rating" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0B4F6C]" />
              Staff Performance Overview
            </h3>
            <ResponsiveContainer width="100%" height={350}>
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
