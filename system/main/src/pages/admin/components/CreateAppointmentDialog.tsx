import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Service {
  service_id: number;
  name: string;
  price: number;
}

export function CreateAppointmentDialog({ open, onOpenChange, onSuccess }: CreateAppointmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: "",
    service_id: "",
    appointment_date: "",
    time: "",
    notes: ""
  });

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, servicesRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/admin/services', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const usersData = await usersRes.json();
      const servicesData = await servicesRes.json();

      // Filter only customers (assuming role check or just showing all for now)
      // Ideally backend should filter or we filter here if we have role info
      setUsers(usersData.filter((u: any) => u.role === 'Customer' || !u.role)); 
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to load form data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Combine date and time
      const dateTime = new Date(`${formData.appointment_date}T${formData.time}`);
      
      const response = await fetch('http://localhost:5000/api/admin/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customer_id: formData.customer_id,
          service_id: formData.service_id,
          appointment_date: dateTime.toISOString(),
          notes: formData.notes
        })
      });

      if (!response.ok) throw new Error('Failed to create appointment');

      toast.success("Appointment created successfully");
      onSuccess();
      onOpenChange(false);
      setFormData({
        customer_id: "",
        service_id: "",
        appointment_date: "",
        time: "",
        notes: ""
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select 
              value={formData.customer_id} 
              onValueChange={(val) => setFormData({...formData, customer_id: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                    {user.first_name} {user.last_name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select 
              value={formData.service_id} 
              onValueChange={(val) => setFormData({...formData, service_id: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.service_id} value={service.service_id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                required
                value={formData.appointment_date}
                onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time" 
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.customer_id || !formData.service_id || !formData.appointment_date || !formData.time} className="bg-[#0B4F6C] hover:bg-[#093e54]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
