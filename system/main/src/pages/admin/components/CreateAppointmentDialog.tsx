import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFeedback } from "@/context/FeedbackContext";
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
  const { showPromise } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: "",
    service_id: "",
    technician_id: "",
    appointment_date: "",
    time: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const [usersRes, servicesRes, techsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/admin/services', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/admin/users?role=Technician', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const usersData = await usersRes.json();
      const servicesData = await servicesRes.json();
      const techsData = await techsRes.json();

      // Filter only customers (assuming role check or just showing all for now)
      // Ideally backend should filter or we filter here if we have role info
      setUsers(usersData.filter((u: any) => u.role === 'Customer' || !u.role)); 
      setServices(servicesData);
      setTechnicians(techsData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const promise = async () => {
      const token = sessionStorage.getItem('token');
      
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
          technician_id: formData.technician_id || null,
          appointment_date: dateTime.toISOString(),
          address: formData.address,
          notes: formData.notes
        })
      });

      if (!response.ok) throw new Error('Failed to create appointment');

      onSuccess();
      onOpenChange(false);
      setFormData({
        customer_id: "",
        service_id: "",
        technician_id: "",
        appointment_date: "",
        time: "",
        address: "",
        notes: ""
      });
      return "Appointment created successfully";
    };

    showPromise(promise(), {
      loading: 'Creating appointment...',
      success: (data) => data,
      error: 'Failed to create appointment',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-card dark:text-foreground">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer" className="dark:text-foreground">Customer</Label>
            <Select 
              value={formData.customer_id} 
              onValueChange={(val) => setFormData({...formData, customer_id: val})}
            >
              <SelectTrigger className="bg-white dark:bg-background dark:border-input dark:text-foreground">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-popover dark:text-popover-foreground">
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                    {user.first_name} {user.last_name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service" className="dark:text-foreground">Service</Label>
            <Select 
              value={formData.service_id} 
              onValueChange={(val) => setFormData({...formData, service_id: val})}
            >
              <SelectTrigger className="bg-white dark:bg-background dark:border-input dark:text-foreground">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-popover dark:text-popover-foreground">
                {services.map((service) => (
                  <SelectItem key={service.service_id} value={service.service_id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technician" className="dark:text-foreground">Technician (Optional)</Label>
            <Select 
              value={formData.technician_id} 
              onValueChange={(val) => setFormData({...formData, technician_id: val})}
            >
              <SelectTrigger className="bg-white dark:bg-background dark:border-input dark:text-foreground">
                <SelectValue placeholder="Select a technician (Optional)" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-popover dark:text-popover-foreground">
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech.user_id} value={tech.user_id.toString()}>
                    {tech.first_name} {tech.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="dark:text-foreground">Service Address</Label>
            <Input 
              id="address" 
              placeholder="Enter service address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="bg-white dark:bg-background dark:border-input dark:text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="dark:text-foreground">Date</Label>
              <Input 
                id="date" 
                type="date" 
                required
                min={new Date().toLocaleDateString('en-CA')}
                value={formData.appointment_date}
                onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                className="bg-white dark:bg-background dark:border-input dark:text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="dark:text-foreground">Time</Label>
              <Input 
                id="time" 
                type="time" 
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="bg-white dark:bg-background dark:border-input dark:text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-foreground">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Additional notes..."
              value={formData.notes}
              className="bg-white dark:bg-background dark:border-input dark:text-foreground"
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
