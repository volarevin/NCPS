import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
        id: Date.now().toString(),
        name: "",
        category: "Installation",
        description: "",
        price: "",
        color: "#FF9B66",
      });
    }
  }, [service]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (service) {
      onDelete(service.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#B8D8D8] border-2 md:border-4 border-[#0B4F6C] rounded-2xl p-0">
        <div className="p-4 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl text-[#0B4F6C]">
              {service ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 md:space-y-6 mt-4">
            {/* Service Name */}
            <div>
              <label className="block text-sm md:text-base text-[#0B4F6C] font-semibold mb-2">Service name:</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg p-3 md:p-4 h-auto focus:border-[#0B4F6C] focus:ring-[#0B4F6C]"
                placeholder="Enter service name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm md:text-base text-[#0B4F6C] font-semibold mb-2">Category:</label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg p-3 md:p-4 h-auto focus:border-[#0B4F6C] focus:ring-[#0B4F6C]">
                  <SelectValue />
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

            {/* Description */}
            <div>
              <label className="block text-sm md:text-base text-[#0B4F6C] font-semibold mb-2">Description:</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg p-3 md:p-4 min-h-[100px] md:min-h-[120px] resize-none focus:border-[#0B4F6C] focus:ring-[#0B4F6C]"
                placeholder="Enter service description"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm md:text-base text-[#0B4F6C] font-semibold mb-2">Price:</label>
              <Input
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg p-3 md:p-4 h-auto focus:border-[#0B4F6C] focus:ring-[#0B4F6C]"
                placeholder="₱ 0.00"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 pt-4">
              {service && (
                <button
                  onClick={handleDelete}
                  className="w-full md:w-auto bg-[#DC3545] hover:bg-[#C82333] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => onOpenChange(false)}
                className="w-full md:w-auto bg-[#6C757D] hover:bg-[#5A6268] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="w-full md:w-auto bg-[#0B4F6C] hover:bg-[#084058] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}