import { Calendar, Clock, History, User, MapPin, Star, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { PageHeader } from "./PageHeader";

interface TechnicianAppointmentsProps {
  appointments: any[];
  setSelectedAppointment: (apt: any) => void;
  updateAppointmentStatus: (id: string, status: any) => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export function TechnicianAppointments({
  appointments,
  setSelectedAppointment,
  updateAppointmentStatus,
  getStatusBadge
}: TechnicianAppointmentsProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader 
        title="My Appointments"
        description="Manage your assigned service appointments."
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-[#0B4F6C] text-[#0B4F6C] hover:bg-[#E8F5F4]">
              <History className="w-4 h-4" />
              History
            </Button>
            <Button className="bg-[#0B4F6C] hover:bg-[#145A75] gap-2 shadow-md hover:shadow-lg transition-all">
              <Calendar className="w-4 h-4" />
              Calendar View
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment List */}
        <div className="lg:col-span-2 space-y-4">
          {appointments.map((apt) => (
            <Card 
              key={apt.id}
              className="hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
              onClick={() => setSelectedAppointment(apt)}
            >
              <div className="flex flex-col sm:flex-row">
                <div className={`w-full sm:w-2 ${
                  apt.status === "Pending" ? "bg-orange-500" :
                  apt.status === "In Progress" ? "bg-blue-500" :
                  apt.status === "Completed" ? "bg-green-500" : "bg-red-500"
                }`} />
                <CardContent className="flex-1 p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#0B4F6C] transition-colors">{apt.service}</h3>
                        {getStatusBadge(apt.status)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{apt.customerName}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {apt.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{apt.address}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 sm:w-full hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppointment(apt);
                        }}
                      >
                        View Details
                      </Button>
                      {apt.status === "Pending" && (
                        <Button 
                          size="sm" 
                          className="flex-1 sm:w-full bg-blue-500 hover:bg-blue-600 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAppointmentStatus(apt.id, "In Progress");
                          }}
                        >
                          Start
                        </Button>
                      )}
                      {apt.status === "In Progress" && (
                        <Button 
                          size="sm" 
                          className="flex-1 sm:w-full bg-green-500 hover:bg-green-600 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAppointmentStatus(apt.id, "Completed");
                          }}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Stats / Summary */}
        <div className="space-y-6">
          <Card className="bg-[#0B4F6C] text-white border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Weekly Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Completed Jobs</span>
                  <span className="font-bold text-2xl">12</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Hours Worked</span>
                  <span className="font-bold text-2xl">34h</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Customer Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-2xl">4.9</span>
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-[#0B4F6C]">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Urgent: Laptop Repair for Maria Santos is overdue by 2 hours.
                </AlertDescription>
              </Alert>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Reminder: Submit weekly report by Friday 5PM.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
