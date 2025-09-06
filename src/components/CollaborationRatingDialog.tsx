import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";
import { useCollaborationRatings } from "../hooks/useCollaborationRatings";
import { useToast } from "../hooks/use-toast";

interface CollaborationRatingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
}

export const CollaborationRatingDialog = ({
    isOpen,
    onClose,
    userId,
    userName
}: CollaborationRatingDialogProps) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [existingRating, setExistingRating] = useState(false);

    const { rateCollaborator, getUserRating, loading } = useCollaborationRatings();
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen && userId) {
            loadExistingRating();
        }
    }, [isOpen, userId]);

    const loadExistingRating = async () => {
        try {
            const existing = await getUserRating(userId);
            if (existing) {
                setRating(existing.rating);
                setComment(existing.comment || "");
                setExistingRating(true);
            } else {
                setRating(0);
                setComment("");
                setExistingRating(false);
            }
        } catch (error) {
            console.error('Error loading existing rating:', error);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: "Please select a rating",
                description: "You must select at least 1 star to rate a collaborator",
                variant: "destructive",
            });
            return;
        }

        try {
            await rateCollaborator(userId, rating, comment);
            toast({
                title: "Rating submitted",
                description: `You have ${existingRating ? 'updated your' : 'given a'} rating for ${userName}`,
            });
            onClose();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit rating",
                variant: "destructive",
            });
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isActive = starValue <= (hoveredRating || rating);

            return (
                <Star
                    key={starValue}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                        isActive ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'
                    }`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                />
            );
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {existingRating ? 'Update Rating' : 'Rate'} for {userName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            How would you rate your collaboration with {userName}?
                        </p>

                        <div className="flex justify-center gap-1 mb-2">
                            {renderStars()}
                        </div>

                        {rating > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {rating === 1 && "Poor collaboration"}
                                {rating === 2 && "Below average collaboration"}
                                {rating === 3 && "Average collaboration"}
                                {rating === 4 && "Good collaboration"}
                                {rating === 5 && "Excellent collaboration"}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Comment (Optional)
                        </label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience working with this collaborator..."
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading || rating === 0}>
                            {loading ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};