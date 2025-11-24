import { useState } from "react";
import { Star, User, Calendar, MessageSquare } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog";
import { PageHeader } from "./PageHeader";

interface Rating {
  id: string;
  customerName: string;
  service: string;
  rating: number;
  feedback: string;
  date: string;
}

interface TechnicianRatingsProps {
  ratings: Rating[];
  renderStars: (rating: number) => JSX.Element[];
}

export function TechnicianRatings({ ratings, renderStars }: TechnicianRatingsProps) {
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader 
        title="My Ratings"
        description="View feedback and ratings from your completed services."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ratings.map((rating) => (
          <Card 
            key={rating.id} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-yellow-400 group"
            onClick={() => setSelectedRating(rating)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#0B4F6C] transition-colors">{rating.service}</h3>
                  <p className="text-sm text-gray-500">{rating.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {renderStars(rating.rating)}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{rating.customerName}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 line-clamp-2 italic">"{rating.feedback}"</p>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#0B4F6C] hover:text-[#0B4F6C] hover:bg-[#E8F5F4]"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedRating} onOpenChange={(open) => !open && setSelectedRating(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0B4F6C] flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              Rating Details
            </DialogTitle>
            <DialogDescription>
              Feedback from {selectedRating?.customerName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRating && (
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <div className="flex gap-1 p-3 bg-yellow-50 rounded-full">
                  {renderStars(selectedRating.rating)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase">Service</label>
                    <p className="font-medium text-gray-900">{selectedRating.service}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase">Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{selectedRating.date}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Customer</label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{selectedRating.customerName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    Feedback
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-700 italic leading-relaxed">"{selectedRating.feedback}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setSelectedRating(null)} className="bg-[#0B4F6C] hover:bg-[#145A75]">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
