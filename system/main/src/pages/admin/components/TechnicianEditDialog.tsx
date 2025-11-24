import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Ban, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { SPECIALTIES } from "./AddTechnicianDialog";

interface TechnicianEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician: any;
  onEdit: (id: number, data: any) => Promise<void>;
  onBan: (id: number) => Promise<void>;
  onDemote: (id: number) => Promise<void>;
}

export function TechnicianEditDialog({
  open,
  onOpenChange,
  technician,
  onEdit,
  onBan,
  onDemote
}: TechnicianEditDialogProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    specialty: ""
  });

  useEffect(() => {
    if (technician) {
      setFormData({
        first_name: technician.firstName || technician.name.split(' ')[0],
        last_name: technician.lastName || technician.name.split(' ').slice(1).join(' '),
        phone_number: technician.phone,
        address: technician.location,
        specialty: technician.specialty
      });
    }
  }, [technician]);

  const handleSave = async () => {
    if (technician) {
      await onEdit(parseInt(technician.id), formData);
      onOpenChange(false);
    }
  };

  if (!technician) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0B4F6C]">Edit Technician Profile</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Select
              value={formData.specialty}
              onValueChange={(val) => setFormData({ ...formData, specialty: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((specialty) => (
                  <SelectItem key={specialty.value} value={specialty.value}>
                    <div className="flex items-center gap-2">
                      <specialty.icon className={`w-4 h-4 ${specialty.color}`} />
                      <span>{specialty.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={() => onBan(parseInt(technician.id))}
              className="bg-red-100 text-red-600 hover:bg-red-200 border-0"
            >
              <Ban className="w-4 h-4 mr-2" />
              Ban User
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onDemote(parseInt(technician.id))}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Demote
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#0B4F6C] hover:bg-[#093d54]">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
