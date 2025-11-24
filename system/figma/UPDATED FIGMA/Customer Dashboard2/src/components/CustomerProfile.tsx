import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Trash2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@email.com',
    phone: '+63 919 876 5432',
    address: '123 Main St, Nasugbu, Batangas',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    // Handle profile update
    console.log('Updating profile:', formData);
    setIsEditing(false);
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
    <div className="p-3 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-8">
        <div>
          <h1 className="text-[#1A5560] mb-1 text-xl md:text-3xl">My Account</h1>
          <p className="text-[#1A5560]/70 text-xs md:text-base">Manage your account information and settings.</p>
        </div>
        {!isEditing ? (
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
        )}
      </div>

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
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#1A5560]/40" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="pl-9 md:pl-10 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 md:h-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="lastName" className="text-[#1A5560] text-xs md:text-sm">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#1A5560]/40" />
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="pl-9 md:pl-10 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 md:h-10 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="email" className="text-[#1A5560] text-xs md:text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#1A5560]/40" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-9 md:pl-10 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 md:h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="phone" className="text-[#1A5560] text-xs md:text-sm">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#1A5560]/40" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="pl-9 md:pl-10 border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 md:h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="address" className="text-[#1A5560] text-xs md:text-sm">
                Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-[#1A5560]/40" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  className="pl-9 md:pl-10 border-[#1A5560]/20 focus:border-[#3FA9BC] min-h-[60px] md:min-h-[80px] text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="space-y-3 md:space-y-6">
          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-[#1A5560] mb-3 md:mb-4 text-base md:text-xl">Security</h2>
            <Button
              onClick={() => setShowPasswordDialog(true)}
              variant="outline"
              className="w-full border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10 transition-colors duration-200 h-9 text-sm"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-[#1A5560] mb-3 md:mb-4 text-base md:text-xl">Account Statistics</h2>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-gray-200">
                <span className="text-[#1A5560]/70 text-xs md:text-sm">Total Appointments</span>
                <span className="text-[#1A5560] text-sm md:text-base font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-gray-200">
                <span className="text-[#1A5560]/70 text-xs md:text-sm">Completed</span>
                <span className="text-green-600 text-sm md:text-base font-semibold">10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1A5560]/70 text-xs md:text-sm">Member Since</span>
                <span className="text-[#1A5560] text-sm md:text-base font-semibold">Jan 2025</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl shadow-sm p-4 md:p-6 border border-red-200 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-red-600 mb-1.5 md:mb-2 text-base md:text-xl">Danger Zone</h2>
            <p className="text-xs md:text-sm text-red-600/70 mb-3 md:mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50 transition-colors duration-200 h-9 text-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1A5560]">Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and choose a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-3 md:space-y-4 py-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="currentPassword" className="text-[#1A5560] text-xs md:text-sm">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 md:h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="newPassword" className="text-[#1A5560] text-xs md:text-sm">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 md:h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#1A5560] text-xs md:text-sm">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="border-[#1A5560]/20 focus:border-[#3FA9BC] h-9 md:h-10 text-sm"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10 h-9 text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePasswordChange}
              className="bg-[#3FA9BC] hover:bg-[#2A6570] h-9 text-sm"
            >
              Change Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure? This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10 h-9 text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white h-9 text-sm"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}