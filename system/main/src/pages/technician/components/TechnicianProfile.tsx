import { useState } from "react";
import { Edit, Mail, Phone, MapPin, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { PageHeader } from "./PageHeader";

interface TechnicianProfileProps {
  technicianProfile: any;
  setTechnicianProfile: (profile: any) => void;
  updateProfile: (profile: any) => Promise<void>;
  technicianRatings: any[];
  handleDeleteAccount: () => void;
  renderStars: (rating: number) => JSX.Element[];
}

export function TechnicianProfile({
  technicianProfile,
  setTechnicianProfile,
  updateProfile,
  technicianRatings,
  handleDeleteAccount,
  renderStars
}: TechnicianProfileProps) {
  const [editingProfile, setEditingProfile] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader 
        title="My Profile"
        description="Manage your personal information and account settings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <div className="relative inline-block mb-4 group">
              <Avatar className="w-32 h-32 mx-auto border-4 border-[#E5F4F5] group-hover:border-[#4DBDCC] transition-colors duration-300">
                <AvatarFallback className="text-4xl bg-[#0B4F6C] text-white">
                  {technicianProfile.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute bottom-0 right-0 rounded-full shadow-lg hover:bg-[#4DBDCC] hover:text-white transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold text-[#0B4F6C]">{technicianProfile.name}</h2>
            <p className="text-gray-500 mb-4">Senior Technician</p>
            
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(technicianProfile.rating)}
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {technicianProfile.rating} ({technicianProfile.totalJobs} jobs)
            </p>

            <div className="text-left space-y-3 bg-[#E5F4F5] p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[#0B4F6C]" />
                <span className="truncate">{technicianProfile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-[#0B4F6C]" />
                <span>{technicianProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#0B4F6C]" />
                <span className="truncate">{technicianProfile.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#0B4F6C]">Personal Information</CardTitle>
              <Button 
                variant={editingProfile ? "default" : "outline"}
                onClick={() => {
                  if (editingProfile) {
                    updateProfile(technicianProfile);
                  }
                  setEditingProfile(!editingProfile);
                }}
                className={editingProfile ? "bg-[#0B4F6C] hover:bg-[#145A75]" : "border-[#0B4F6C] text-[#0B4F6C] hover:bg-[#E8F5F4]"}
              >
                {editingProfile ? "Save Changes" : "Edit Profile"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  {editingProfile ? (
                    <input 
                      type="text" 
                      value={technicianProfile.name}
                      onChange={(e) => setTechnicianProfile({...technicianProfile, name: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0B4F6C] focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{technicianProfile.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Specialization</label>
                  {editingProfile ? (
                    <input 
                      type="text" 
                      value={technicianProfile.specialization}
                      onChange={(e) => setTechnicianProfile({...technicianProfile, specialization: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0B4F6C] focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{technicianProfile.specialization}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  {editingProfile ? (
                    <input 
                      type="email" 
                      value={technicianProfile.email}
                      onChange={(e) => setTechnicianProfile({...technicianProfile, email: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0B4F6C] focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{technicianProfile.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  {editingProfile ? (
                    <input 
                      type="tel" 
                      value={technicianProfile.phone}
                      onChange={(e) => setTechnicianProfile({...technicianProfile, phone: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0B4F6C] focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{technicianProfile.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-[#0B4F6C]">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicianRatings.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                        <p className="text-xs text-gray-500">{review.service} • {review.date}</p>
                      </div>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{review.feedback}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data.</p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
