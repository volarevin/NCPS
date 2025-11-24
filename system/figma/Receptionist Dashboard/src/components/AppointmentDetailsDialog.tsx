import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Phone, Mail, MapPin, Wrench, Calendar, Clock, UserCheck, FileText, Save } from 'lucide-react';
import { Appointment } from './AppointmentSchedule';
import { toast } from 'sonner@2.0.3';

interface AppointmentDetailsDialogProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
  onUpdateAppointment,
}: AppointmentDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState<Appointment>(appointment);

  const handleSave = () => {
    onUpdateAppointment(editedAppointment);
    setIsEditing(false);
    toast.success('Appointment updated successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0B4F6C]">
            {isEditing ? 'Edit Appointment' : 'Appointment Details'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update appointment information' : 'View and manage appointment details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-gradient-to-r from-[#E5F4F5] to-white rounded-lg p-4 hover:shadow-md transition-all">
            <h3 className="text-[#0B4F6C] mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName" className="text-[#0B4F6C]">Name</Label>
                {isEditing ? (
                  <Input
                    id="clientName"
                    value={editedAppointment.clientName}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, clientName: e.target.value })}
                    className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.clientName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#0B4F6C] flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Phone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedAppointment.phone}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, phone: e.target.value })}
                    className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.phone}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email" className="text-[#0B4F6C] flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedAppointment.email}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, email: e.target.value })}
                    className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.email}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-[#0B4F6C] flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Address
                </Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editedAppointment.address}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, address: e.target.value })}
                    className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-gradient-to-r from-[#E5F4F5] to-white rounded-lg p-4 hover:shadow-md transition-all">
            <h3 className="text-[#0B4F6C] mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service" className="text-[#0B4F6C]">Service</Label>
                {isEditing ? (
                  <Select
                    value={editedAppointment.service}
                    onValueChange={(value) => setEditedAppointment({ ...editedAppointment, service: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop Repair">Laptop Repair</SelectItem>
                      <SelectItem value="CCTV Installation">CCTV Installation</SelectItem>
                      <SelectItem value="CCTV Repair">CCTV Repair</SelectItem>
                      <SelectItem value="CCTV Upgrade">CCTV Upgrade</SelectItem>
                      <SelectItem value="LCD Replacement">LCD Replacement</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.service}</p>
                )}
              </div>
              <div>
                <Label htmlFor="status" className="text-[#0B4F6C]">Status</Label>
                {isEditing ? (
                  <Select
                    value={editedAppointment.status}
                    onValueChange={(value: any) => setEditedAppointment({ ...editedAppointment, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-gray-700 capitalize p-2 rounded hover:bg-white transition-colors">
                    {editedAppointment.status === 'in-progress' ? 'In Progress' : editedAppointment.status}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="date" className="text-[#0B4F6C] flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Date
                </Label>
                {isEditing ? (
                  <Input
                    id="date"
                    value={editedAppointment.date}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, date: e.target.value })}
                    className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.date}</p>
                )}
              </div>
              <div>
                <Label htmlFor="time" className="text-[#0B4F6C] flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Time
                </Label>
                {isEditing ? (
                  <Input
                    id="time"
                    value={editedAppointment.time}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, time: e.target.value })}
                    className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.time}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="technician" className="text-[#0B4F6C] flex items-center gap-1">
                  <UserCheck className="w-4 h-4" /> Assigned Technician
                </Label>
                {isEditing ? (
                  <Input
                    id="technician"
                    value={editedAppointment.technician}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, technician: e.target.value })}
                    className="mt-1 focus:ring-2 focus:ring-[#4DBDCC] transition-all"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.technician}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gradient-to-r from-[#E5F4F5] to-white rounded-lg p-4 hover:shadow-md transition-all">
            <h3 className="text-[#0B4F6C] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Notes
            </h3>
            {isEditing ? (
              <Textarea
                value={editedAppointment.notes}
                onChange={(e) => setEditedAppointment({ ...editedAppointment, notes: e.target.value })}
                rows={3}
                className="w-full focus:ring-2 focus:ring-[#4DBDCC] transition-all"
              />
            ) : (
              <p className="text-gray-700 p-2 rounded hover:bg-white transition-colors">{editedAppointment.notes || 'No notes available'}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-end pt-4 border-t">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedAppointment(appointment);
                  }}
                  className="hover:bg-gray-100 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#0B4F6C] hover:bg-[#145A75] hover:scale-105 transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-gray-100 transition-all"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#4DBDCC] hover:bg-[#3AACBB] hover:scale-105 transition-all duration-200"
                >
                  Edit Details
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}