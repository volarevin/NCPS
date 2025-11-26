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
import { toast } from 'sonner';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAppointmentDialog({ open, onOpenChange }: CreateAppointmentDialogProps) {
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    address: '', // Note: Address is not yet in the backend schema for appointments, assuming it's part of user profile or notes for now.
    notes: '',
  });
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchServices();
    }
  }, [open]);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to book an appointment.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          date: formData.date,
          time: formData.time,
          notes: `${formData.notes} \n\nAddress: ${formData.address}` // Appending address to notes for now
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      toast.success('Appointment booked successfully!');
      onOpenChange(false);
      // Reset form
      setFormData({ serviceId: '', date: '', time: '', address: '', notes: '' });
      
      // Optional: Trigger a refresh of the appointments list if we had a context or callback
      window.location.reload(); // Simple reload to refresh data for now

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1A5560]">Book New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule your service appointment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="service" className="text-[#1A5560]">
              Service Type *
            </Label>
            <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
              <SelectTrigger className="border-[#1A5560]/20 focus:border-[#3FA9BC]">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.service_id} value={service.service_id.toString()}>
                    {service.service_name} - ₱{service.base_price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-[#1A5560]">
                Preferred Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-[#1A5560]/20 focus:border-[#3FA9BC]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-[#1A5560]">
                Preferred Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border-[#1A5560]/20 focus:border-[#3FA9BC]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-[#1A5560]">
              Service Address *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your complete address"
              className="border-[#1A5560]/20 focus:border-[#3FA9BC]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#1A5560]">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe the issue or provide any specific instructions..."
              className="border-[#1A5560]/20 focus:border-[#3FA9BC] min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#3FA9BC] hover:bg-[#2A6570] text-white transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
