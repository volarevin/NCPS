import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Trash2, Save } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { PageHeader } from './PageHeader';
import { toast } from 'sonner';

export function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '123 Main St, Nasugbu, Batangas', // Hardcoded for now
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/customer/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone_number
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/customer/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Update local storage user info if needed
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...user, firstName: formData.firstName, lastName: formData.lastName }));
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred');
    }
  };

  const handlePasswordChange = () => {
    // Handle password change
    console.log('Changing password');
    setShowPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log('Deleting account');
    setShowDeleteDialog(false);
  };

  return (
    <div className="p-3 md:p-8 animate-fade-in max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader 
        title="My Account"
        description="Manage your account information and settings."
        action={
          !isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#3FA9BC] hover:bg-[#2A6570] transition-colors duration-200 w-full sm:w-auto h-9 text-sm"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10 h-9 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#3FA9BC] hover:bg-[#2A6570] transition-colors duration-200 h-9 text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-[#1A5560] mb-4 md:mb-6 text-base md:text-xl">Profile Information</h2>
          
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="firstName" className="text-[#1A5560] text-xs md:text-sm">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="pl-9 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="lastName" className="text-[#1A5560] text-xs md:text-sm">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="pl-9 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="email" className="text-[#1A5560] text-xs md:text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-9 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="phone" className="text-[#1A5560] text-xs md:text-sm">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-9 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="address" className="text-[#1A5560] text-xs md:text-sm">
                Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  className="pl-9 border-[#1A5560]/20 focus:border-[#3FA9BC] min-h-[80px] text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="space-y-3 md:space-y-6">
          {/* Security */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-[#1A5560] mb-4 text-base md:text-xl">Security</h2>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[#1A5560] font-medium text-sm">Password</p>
                    <p className="text-xs text-[#1A5560]/60">Last changed 3 months ago</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordDialog(true)}
                  className="text-[#3FA9BC] border-[#3FA9BC] hover:bg-[#3FA9BC]/10 h-8 text-xs"
                >
                  Change
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-200 border border-red-100">
            <h2 className="text-red-600 mb-4 text-base md:text-xl">Danger Zone</h2>
            <p className="text-xs md:text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="destructive"
              className="w-full bg-red-500 hover:bg-red-600 h-9 text-sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Password Dialog - Simplified for demo */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and new password below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="current" className="text-xs">Current Password</Label>
              <Input type="password" id="current" className="h-8" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new" className="text-xs">New Password</Label>
              <Input type="password" id="new" className="h-8" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-xs">Confirm New Password</Label>
              <Input type="password" id="confirm" className="h-8" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordChange}>
              Update Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
