import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { AlertCircle } from 'lucide-react';

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
}

export function CancelAppointmentDialog({ open, onOpenChange, appointment }: CancelAppointmentDialogProps) {
  const [reason, setReason] = useState('');

  const handleCancel = () => {
    // Handle appointment cancellation
    console.log('Cancelling appointment:', appointment?.id, 'Reason:', reason);
    onOpenChange(false);
    setReason('');
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#1A5560] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Cancel Appointment
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-[#1A5560]/60 mb-1">Service</p>
            <p className="text-[#1A5560]">{appointment.service}</p>
            <p className="text-sm text-[#1A5560]/60 mt-2 mb-1">Date & Time</p>
            <p className="text-[#1A5560]">
              {appointment.date} at {appointment.time}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-[#1A5560]">
              Reason for Cancellation *
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this appointment..."
              className="border-[#1A5560]/20 focus:border-[#3FA9BC] min-h-[100px]"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setReason('');
              }}
              className="flex-1 border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10"
            >
              Keep Appointment
            </Button>
            <Button
              onClick={handleCancel}
              disabled={!reason.trim()}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
