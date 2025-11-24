import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

export function MyAccount() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Maria Santos',
    email: 'maria.santos@ncps.com',
    phone: '+63 917 345 6789',
    address: '123 Main St, Nasugbu, Batangas',
    role: 'Receptionist',
    bio: 'Dedicated receptionist at NCPS, handling customer appointments and inquiries.',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    toast.success('Password changed successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl text-[#0B4F6C] mb-2">My Account</h1>
        <p className="text-sm sm:text-base text-[#145A75]">Manage your personal information and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Picture */}
        <div className="lg:col-span-1">
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4DBDCC]">
            <CardHeader>
              <CardTitle className="text-[#0B4F6C]">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4DBDCC] to-[#0B4F6C] flex items-center justify-center text-white text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  MS
                </div>
                <button className="absolute bottom-0 right-0 bg-[#4DBDCC] p-2 rounded-full shadow-lg hover:bg-[#3AACBB] transition-all duration-200 hover:scale-110">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-[#0B4F6C]">{profileData.name}</h3>
                <p className="text-sm text-gray-600">{profileData.role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4DBDCC]">
            <CardHeader>
              <CardTitle className="text-[#0B4F6C]">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#E5F4F5] rounded-lg hover:bg-[#D0EEF0] transition-colors duration-200">
                <span className="text-sm text-gray-600">Appointments Today</span>
                <span className="text-[#0B4F6C]">8</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#E5F4F5] rounded-lg hover:bg-[#D0EEF0] transition-colors duration-200">
                <span className="text-sm text-gray-600">Pending Approvals</span>
                <span className="text-orange-600">3</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#E5F4F5] rounded-lg hover:bg-[#D0EEF0] transition-colors duration-200">
                <span className="text-sm text-gray-600">Completed This Week</span>
                <span className="text-green-600">24</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4DBDCC]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-[#0B4F6C]">Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#4DBDCC] hover:bg-[#3AACBB] hover:scale-105 transition-transform duration-200"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <Label htmlFor="name" className="text-[#0B4F6C] flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 p-2 rounded hover:bg-[#E5F4F5] transition-colors">
                      {profileData.name}
                    </p>
                  )}
                </div>
                <div className="group">
                  <Label htmlFor="email" className="text-[#0B4F6C] flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 p-2 rounded hover:bg-[#E5F4F5] transition-colors">
                      {profileData.email}
                    </p>
                  )}
                </div>
                <div className="group">
                  <Label htmlFor="phone" className="text-[#0B4F6C] flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 p-2 rounded hover:bg-[#E5F4F5] transition-colors">
                      {profileData.phone}
                    </p>
                  )}
                </div>
                <div className="group">
                  <Label className="text-[#0B4F6C] flex items-center gap-2">
                    <User className="w-4 h-4" /> Role
                  </Label>
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-[#E5F4F5] transition-colors">
                    {profileData.role}
                  </p>
                </div>
                <div className="md:col-span-2 group">
                  <Label htmlFor="address" className="text-[#0B4F6C] flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 p-2 rounded hover:bg-[#E5F4F5] transition-colors">
                      {profileData.address}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 group">
                  <Label htmlFor="bio" className="text-[#0B4F6C]">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={3}
                      className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 p-2 rounded hover:bg-[#E5F4F5] transition-colors">
                      {profileData.bio}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-[#0B4F6C] hover:bg-[#145A75] hover:scale-105 transition-all duration-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4DBDCC]">
            <CardHeader>
              <CardTitle className="text-[#0B4F6C] flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-[#0B4F6C]">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-[#0B4F6C]">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-[#0B4F6C]">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                />
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleChangePassword}
                  className="bg-[#0B4F6C] hover:bg-[#145A75] hover:scale-105 transition-all duration-200"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}