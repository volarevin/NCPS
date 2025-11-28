import { PageHeader } from "./PageHeader";
import { useState, useEffect } from "react";
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



















export function Reports() {
  const [summary, setSummary] = useState<any>({
    total: 0,
    completed: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    noShow: 0,
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [peakDays, setPeakDays] = useState<any[]>([]);
  const [cancellationReasonsData, setCancellationReasonsData] = useState<any[]>([]);
  const [revenueStats, setRevenueStats] = useState<any>({
    totalRevenue: 0,
    avgPerAppointment: 0,
    totalPaid: 0
  });
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  const handleExport = () => {
    const headers = ["Month", "Appointments", "Completed", "Cancelled", "Revenue"];
    const rows = monthlyData.map(m => [
        m.month,
        m.appointments,
        m.completed,
        m.cancelled,
        m.revenue
    ]);
    
    const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        let url = 'http://localhost:5000/api/admin/reports';
        const params = new URLSearchParams();
        if (dateRange.start) params.append('startDate', dateRange.start);
        if (dateRange.end) params.append('endDate', dateRange.end);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.summary) setSummary(data.summary);
        if (data.monthly) setMonthlyData(data.monthly);
        if (data.services) setServiceData(data.services);
        if (data.staff) {
          setStaffData(data.staff.map((s: any) => ({
            name: `${s.first_name} ${s.last_name}`,
            role: "Technician",
            totalHandled: s.totalHandled,
            confirmed: s.totalHandled,
            rating: parseFloat(s.rating) || 0,
            efficiency: 95
          })));
        }
        if (data.peakHours) setPeakHours(data.peakHours);
        if (data.peakDays) setPeakDays(data.peakDays);
        if (data.cancellationReasons) {
            const colors = ["#5B8FFF", "#FFB366", "#5DD37C", "#FF6B6B", "#A0A0A0"];
            setCancellationReasonsData(data.cancellationReasons.map((r: any, index: number) => ({
                reason: r.reason,
                count: r.count,
                color: colors[index % colors.length]
            })));
        }
        if (data.revenueStats) setRevenueStats(data.revenueStats);

      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [dateRange]);

  const appointmentSummaryData = summary;
  const monthlyAppointments = monthlyData;
  const servicePerformanceData = serviceData;
  const staffPerformanceData = staffData;
  const monthlyRevenue = monthlyData.map(m => ({
      month: m.month,
      paid: m.revenue || 0
  }));
  const peakHoursData = peakHours;
  const peakDaysData = peakDays;
  const cancellationReasons = cancellationReasonsData;
  const revenueData = revenueStats;
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Reports & Analytics" 
        description="View detailed reports and analytics for your business."
        action={
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-1">
                <span className="text-sm text-gray-500">From:</span>
                <input 
                    type="date" 
                    className="text-sm focus:outline-none"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-1">
                <span className="text-sm text-gray-500">To:</span>
                <input 
                    type="date" 
                    className="text-sm focus:outline-none"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
            </div>
            <button 
                onClick={handleExport}
                className="bg-[#0B4F6C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#093e54] transition-colors"
            >
              Export Report
            </button>
          </div>
        }
      />

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
                  <YAxis dataKey="name" type="category" width={150} />
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
                  <YAxis dataKey="name" type="category" width={150} />
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
                          {staff.rating.toFixed(1)}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Bar dataKey="paid" fill="#5DD37C" name="Paid" />
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
                    label={({ reason, percent }: any) =>
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
