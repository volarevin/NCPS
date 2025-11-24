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
import { Star } from 'lucide-react';

interface RateTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
}

export function RateTechnicianDialog({ open, onOpenChange, appointment }: RateTechnicianDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    // Handle rating submission
    console.log('Rating:', rating, 'Feedback:', feedback);
    onOpenChange(false);
    setRating(0);
    setHoveredRating(0);
    setFeedback('');
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#1A5560]">Rate Your Service</DialogTitle>
          <DialogDescription>
            How was your experience with {appointment.technician}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-[#1A5560]/60 mb-1">Service</p>
            <p className="text-[#1A5560]">{appointment.service}</p>
            <p className="text-sm text-[#1A5560]/60 mt-2 mb-1">Date</p>
            <p className="text-[#1A5560]">{appointment.date}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-[#1A5560]">Rating *</Label>
            <div className="flex gap-2 justify-center py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-[#1A5560]/60">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-[#1A5560]">
              Feedback (Optional)
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with us..."
              className="border-[#1A5560]/20 focus:border-[#3FA9BC] min-h-[100px]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setRating(0);
                setHoveredRating(0);
                setFeedback('');
              }}
              className="flex-1 border-[#1A5560] text-[#1A5560] hover:bg-[#1A5560]/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-[#3FA9BC] hover:bg-[#2A6570] transition-colors duration-200"
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
