import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  color: string;
}

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSave: (service: Service) => void;
  onDelete: (id: string) => void;
}

export function EditServiceDialog({
  open,
  onOpenChange,
  service,
  onSave,
  onDelete,
}: EditServiceDialogProps) {
  const [formData, setFormData] = useState<Service>({
    id: "",
    name: "",
    category: "Installation",
    description: "",
    price: "",
    color: "#FF9B66",
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        category: "Installation",
        description: "",
        price: "",
        color: "#FF9B66",
      });
    }
  }, [service, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this service?")) {
      onDelete(formData.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0B4F6C]">
            {service ? "Edit Service" : "Add New Service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Service Name
            </label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Laptop Repair"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Installation">Installation</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Upgrade & Maintenance">
                  Upgrade & Maintenance
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Service description..."
              className="h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <Input
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="e.g. ₱ 2,500.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Color Theme
              </label>
              <div className="flex gap-2 mt-2">
                {["#5B8FFF", "#FF9B66", "#5DD37C", "#FF6B6B"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      formData.color === color
                        ? "ring-2 ring-offset-2 ring-[#0B4F6C] scale-110"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            {service && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium mr-auto"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0B4F6C] text-white rounded-lg hover:bg-[#093e54] transition-colors font-medium"
            >
              {service ? "Save Changes" : "Create Service"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
