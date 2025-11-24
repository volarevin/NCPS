import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface EditAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
}

export function EditAppointmentDialog({ open, onOpenChange, appointment }: EditAppointmentDialogProps) {
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        service: appointment.service || '',
        date: appointment.date || '',
        time: appointment.time || '',
        address: appointment.address || '',
        notes: appointment.notes || '',
      });
    }
  }, [appointment]);

  const services = [
    'Computer Repair',
    'Laptop Repair',
    'CCTV Installation',
    'Network Setup',
    'Hardware Upgrade',
    'Software Installation',
    'Virus Removal',
    'Data Recovery',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment update
    console.log('Updating appointment:', appointment?.id, formData);
    onOpenChange(false);
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1A5560]">Edit Appointment</DialogTitle>
          <DialogDescription>
            Update your appointment details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="service" className="text-[#1A5560] text-sm">
              Service Type *
            </Label>
            <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
              <SelectTrigger className="border-[#1A5560]/20 focus:border-[#3FA9BC] h-9">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-[#1A5560] text-sm">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-[#1A5560]/20 focus:border-[#3FA9BC] h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="time" className="text-[#1A5560] text-sm">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border-[#1A5560]/20 focus:border-[#3FA9BC] h-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-[#1A5560] text-sm">
              Service Address *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your complete address"
              className="border-[#1A5560]/20 focus:border-[#3FA9BC] h-9"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-[#1A5560] text-sm">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe the issue or provide any specific instructions..."
              className="border-[#1A5560]/20 focus:border-[#3FA9BC] min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10 h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#3FA9BC] hover:bg-[#2A6570] text-white transition-colors duration-200 h-9"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
