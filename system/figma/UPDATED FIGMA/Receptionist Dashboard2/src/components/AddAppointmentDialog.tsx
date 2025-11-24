import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { Appointment } from './AppointmentSchedule';

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAppointment: (appointment: Appointment) => void;
}

export function AddAppointmentDialog({
  open,
  onOpenChange,
  onAddAppointment,
}: AddAppointmentDialogProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    address: '',
    service: '',
    date: '',
    time: '',
    technician: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.clientName || !formData.phone || !formData.service || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      technician: formData.technician || 'Unassigned',
      status: 'pending',
      notes: formData.notes,
    };

    onAddAppointment(newAppointment);
    toast.success('Walk-in appointment added successfully');
    
    // Reset form
    setFormData({
      clientName: '',
      phone: '',
      email: '',
      address: '',
      service: '',
      date: '',
      time: '',
      technician: '',
      notes: '',
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0B4F6C]">Add Walk-In Appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment for walk-in customers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="bg-[#E5F4F5] rounded-lg p-4">
            <h3 className="text-[#0B4F6C] mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName" className="text-[#0B4F6C]">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Enter client name"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#0B4F6C]">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+63 XXX XXX XXXX"
                  className="mt-1"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email" className="text-[#0B4F6C]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@email.com"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-[#0B4F6C]">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full address"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-[#E5F4F5] rounded-lg p-4">
            <h3 className="text-[#0B4F6C] mb-4">Service Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service" className="text-[#0B4F6C]">
                  Service <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laptop Repair">Laptop Repair</SelectItem>
                    <SelectItem value="CCTV Installation">CCTV Installation</SelectItem>
                    <SelectItem value="CCTV Repair">CCTV Repair</SelectItem>
                    <SelectItem value="CCTV Upgrade">CCTV Upgrade</SelectItem>
                    <SelectItem value="LCD Replacement">LCD Replacement</SelectItem>
                    <SelectItem value="Desktop Repair">Desktop Repair</SelectItem>
                    <SelectItem value="Network Setup">Network Setup</SelectItem>
                    <SelectItem value="Data Recovery">Data Recovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="technician" className="text-[#0B4F6C]">Assign Technician</Label>
                <Select
                  value={formData.technician}
                  onValueChange={(value) => setFormData({ ...formData, technician: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tech John Doe">Tech John Doe</SelectItem>
                    <SelectItem value="Tech Jane Smith">Tech Jane Smith</SelectItem>
                    <SelectItem value="Tech Mike Johnson">Tech Mike Johnson</SelectItem>
                    <SelectItem value="Tech Sarah Lee">Tech Sarah Lee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date" className="text-[#0B4F6C]">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-[#0B4F6C]">
                  Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#E5F4F5] rounded-lg p-4">
            <Label htmlFor="notes" className="text-[#0B4F6C]">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes or special instructions..."
              rows={3}
              className="w-full mt-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0B4F6C] hover:bg-[#145A75]"
            >
              Add Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}