import { Calendar, Clock, PlayCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

interface TechnicianDashboardContentProps {
  technicianProfile: any;
  stats: any[];
  todayAppointments: any[];
  upcomingAppointments: any[];
  setSelectedAppointment: (apt: any) => void;
  setActiveTab: (tab: "dashboard" | "appointments" | "profile") => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export function TechnicianDashboardContent({
  technicianProfile,
  stats,
  todayAppointments,
  upcomingAppointments,
  setSelectedAppointment,
  setActiveTab,
  getStatusBadge
}: TechnicianDashboardContentProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0B4F6C]">Welcome back, {technicianProfile.name.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-1">Here's your schedule overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.color} border-l-4 shadow-sm hover:shadow-md transition-all duration-200 bg-white`}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#0B4F6C] mt-1">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0B4F6C]">Today's Schedule</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab("appointments")}
              className="text-[#0B4F6C] border-[#0B4F6C] hover:bg-[#E8F5F4]"
            >
              View All
            </Button>
          </div>
          
          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <Card 
                  key={apt.id}
                  className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-[#0B4F6C] group"
                  onClick={() => setSelectedAppointment(apt)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#E8F5F4] p-3 rounded-full text-[#0B4F6C] group-hover:bg-[#0B4F6C] group-hover:text-white transition-colors">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{apt.time}</h3>
                        <p className="text-sm text-gray-600">{apt.service}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{apt.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(apt.status)}
                      <Button size="icon" variant="ghost" className="text-gray-400 group-hover:text-[#0B4F6C]">
                        <PlayCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No appointments scheduled for today.</p>
              </CardContent>
            </Card>
          )}

          {/* Upcoming */}
          <div className="pt-4">
            <h2 className="text-xl font-bold text-[#0B4F6C] mb-4">Upcoming This Week</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <Card 
                    key={apt.id}
                    className="hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-full text-gray-600 group-hover:bg-[#0B4F6C] group-hover:text-white transition-colors">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{apt.date}</h3>
                          <p className="text-sm text-gray-600">{apt.service}</p>
                        </div>
                      </div>
                      {getStatusBadge(apt.status)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments this week.</p>
            )}
          </div>
        </div>

        {/* Recent Activity / Notifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0B4F6C]">Notifications</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New appointment assigned</p>
                      <p className="text-xs text-gray-500 mt-1">Admin assigned you to a CCTV Installation on Nov 28.</p>
                      <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Job completed successfully</p>
                      <p className="text-xs text-gray-500 mt-1">You marked "Laptop Repair" for Maria Santos as completed.</p>
                      <p className="text-xs text-gray-400 mt-2">Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New Rating Received</p>
                      <p className="text-xs text-gray-500 mt-1">Maria Santos gave you 5 stars!</p>
                      <p className="text-xs text-gray-400 mt-2">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
