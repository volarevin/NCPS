import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  User,
  Mail,
  Phone,
  Shield,
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
  Calendar,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface UserData {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: "customer" | "staff";
  avatar?: string;
  joinedDate: string;
  activityLogs: ActivityLog[];
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
  onSave: (user: UserData) => void;
  onPromote: (id: string) => void;
  onDemote: (id: string) => void;
}

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
  onSave,
  onPromote,
  onDemote,
}: UserDetailsDialogProps) {
  const [formData, setFormData] = useState<UserData | null>(null);
  const [showActivityLogs, setShowActivityLogs] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setShowActivityLogs(false);
    }
  }, [user]);

  if (!formData) return null;

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  const handleRoleChange = () => {
    if (formData.role === "customer") {
      onPromote(formData.id);
    } else {
      onDemote(formData.id);
    }
  };

  const roleColors = {
    customer: "#5B8FFF",
    staff: "#7B9B7C",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-3xl bg-[#B8D8D8] border-2 md:border-4 border-[#0B4F6C] rounded-2xl p-0 max-h-[90vh] overflow-hidden">
        <div className="p-4 md:p-8 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl text-[#0B4F6C]">
              User Details
            </DialogTitle>
          </DialogHeader>

          {!showActivityLogs ? (
            <div className="space-y-4 md:space-y-6 mt-4">
              {/* User Avatar and Role */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 bg-white/50 rounded-xl p-4 md:p-6 border-2 border-gray-300">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.fullName}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0"
                    style={{ backgroundColor: roleColors[formData.role] }}
                  >
                    <User className="w-10 h-10 md:w-12 md:h-12" />
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl text-gray-800 mb-2">
                    {formData.fullName}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mb-3">@{formData.username}</p>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                    <div
                      className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-white flex items-center gap-2 text-sm md:text-base"
                      style={{ backgroundColor: roleColors[formData.role] }}
                    >
                      {formData.role === "customer" ? (
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                      ) : (
                        <Shield className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                      {formData.role.charAt(0).toUpperCase() +
                        formData.role.slice(1)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      Joined {formData.joinedDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm md:text-base text-[#0B4F6C] font-semibold mb-2">Full Name:</label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg p-3 md:p-4 h-auto focus:border-[#0B4F6C] focus:ring-[#0B4F6C]"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base text-[#0B4F6C] font-semibold mb-2">Username:</label>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg p-3 md:p-4 h-auto focus:border-[#0B4F6C] focus:ring-[#0B4F6C]"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base text-[#0B4F6C] font-semibold mb-2">Email:</label>
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg p-3 md:p-4 h-auto focus:border-[#0B4F6C] focus:ring-[#0B4F6C]"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base text-[#0B4F6C] font-semibold mb-2">Phone:</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg p-3 md:p-4 h-auto focus:border-[#0B4F6C] focus:ring-[#0B4F6C]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 pt-4">
                <button
                  onClick={handleRoleChange}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-white transition-colors text-sm md:text-base ${
                    formData.role === "customer"
                      ? "bg-[#7B9B7C] hover:bg-[#6B8B6C]"
                      : "bg-[#5B8FFF] hover:bg-[#4B7FEF]"
                  }`}
                >
                  {formData.role === "customer" ? (
                    <>
                      <ArrowUpCircle className="w-4 h-4 md:w-5 md:h-5" />
                      Promote to Staff
                    </>
                  ) : (
                    <>
                      <ArrowDownCircle className="w-4 h-4 md:w-5 md:h-5" />
                      Demote to Customer
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowActivityLogs(true)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#4A6F7C] hover:bg-[#3A5F6C] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base"
                >
                  <Activity className="w-4 h-4 md:w-5 md:h-5" />
                  View Activity Logs
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 pt-2">
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
          ) : (
            <div className="space-y-4 mt-4">
              {/* Activity Logs View */}
              <div className="bg-white/50 rounded-xl p-4 md:p-6 border-2 border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base md:text-xl text-[#0B4F6C] font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden md:inline">Activity Logs for {formData.fullName}</span>
                    <span className="md:hidden">Activity Logs</span>
                  </h3>
                  <button
                    onClick={() => setShowActivityLogs(false)}
                    className="text-sm md:text-base text-[#0B4F6C] hover:text-[#084058] font-semibold"
                  >
                    Back
                  </button>
                </div>

                <ScrollArea className="h-[300px] md:h-[400px] pr-2 md:pr-4">
                  <div className="space-y-2 md:space-y-3">
                    {formData.activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-white rounded-lg p-3 md:p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-[#0B4F6C] text-white text-xs md:text-sm w-fit"
                          >
                            {log.action}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-700">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowActivityLogs(false)}
                  className="w-full md:w-auto bg-[#0B4F6C] hover:bg-[#084058] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}