import {
  ComposedChart,
  Line,
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
import { Calendar, Wrench, CheckCircle, Users, UserCheck, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "./PageHeader";

const COLORS = ["#5B8FFF", "#FFB366", "#5DD37C", "#FF6B6B", "#8884d8", "#9CA3AF"]; // Added Gray for Others

export function Dashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [serviceStats, setServiceStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        const [statsRes, monthlyRes, serviceRes, activityRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/stats', { headers }),
          fetch('http://localhost:5000/api/admin/monthly-stats', { headers }),
          fetch('http://localhost:5000/api/admin/service-distribution', { headers }),
          fetch('http://localhost:5000/api/admin/recent-activity', { headers })
        ]);

        if (statsRes.status === 401 || monthlyRes.status === 401 || serviceRes.status === 401 || activityRes.status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const stats = await statsRes.json();
        const monthly = await monthlyRes.json();
        const services = await serviceRes.json();
        const activity = await activityRes.json();

        setStatsData(stats);
        setMonthlyStats(monthly);
        
        // Format service stats for Pie Chart
        setServiceStats(services.map((s: any, index: number) => ({
          name: s.name,
          value: s.value,
          color: s.name === "Others" ? "#9CA3AF" : COLORS[index % COLORS.length]
        })));

        // Format activity
        setRecentActivity(activity.map((a: any) => {
          let icon = Users;
          let color = "#5B8FFF";

          if (a.action.includes("Appointment") || a.action.includes("Booked")) {
            icon = Calendar;
            color = "#5B8FFF";
          } else if (a.action.includes("Completed") || a.action.includes("Repair")) {
            icon = CheckCircle;
            color = "#5DD37C";
          } else if (a.action.includes("Registered") || a.action.includes("Profile")) {
            icon = UserCheck;
            color = "#FFB366";
          }

          return {
            user: `${a.first_name} ${a.last_name}`,
            action: a.action,
            time: new Date(a.time).toLocaleString(), // Simple formatting
            icon,
            color
          };
        }));

      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number | string) => {
    if (!num) return "0";
    return Number(num).toLocaleString();
  };

  const formatCurrency = (num: number | string) => {
    if (!num) return "₱0";
    return `₱${Number(num).toLocaleString()}`;
  };

  const stats = [
    {
      icon: Calendar,
      value: formatNumber(statsData?.today_appointments),
      label: "Today's Appointments",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      iconBg: "#5B8FFF",
    },
    {
      icon: Wrench,
      value: formatNumber(statsData?.pending_requests),
      label: "Pending Requests",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      iconBg: "#FFB366",
    },
    {
      icon: Activity,
      value: formatNumber(statsData?.in_progress_count),
      label: "In Progress",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      iconBg: "#3B82F6",
    },
    {
      icon: TrendingUp,
      value: formatCurrency(statsData?.monthly_revenue),
      label: "Monthly Revenue",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      iconBg: "#5DD37C",
    },
    {
      icon: Users,
      value: formatNumber(statsData?.available_techs),
      label: "Available Technicians",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      iconBg: "#757575",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Dashboard Overview" 
        description="Welcome back, Admin. Here's what's happening with your operations today."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card p-6 rounded-2xl shadow-sm border border-border flex items-center space-x-4"
          >
            <div
              className={`p-3 rounded-xl ${stat.bgColor}`}
            >
              <stat.icon
                className="w-6 h-6"
                style={{ color: stat.iconBg }}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Appointments & Revenue Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Monthly Performance
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  yAxisId="left" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `₱${value/1000}k`} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    color: "hsl(var(--popover-foreground))"
                  }}
                  itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                  labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  formatter={(value: any, name: string) => [
                    name === "Revenue" ? `₱${Number(value).toLocaleString()}` : value,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                <Bar
                  yAxisId="left"
                  dataKey="appointments"
                  name="Appointments"
                  fill="#5B8FFF"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue"
                  stroke="#FFB366" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#FFB366", strokeWidth: 2, stroke: "hsl(var(--card))" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
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
                  <p className="text-sm font-medium text-foreground">
                    {activity.user}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Distribution */}
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Service Distribution
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--popover-foreground))"
                }}
                itemStyle={{ color: "hsl(var(--popover-foreground))" }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
