import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { toast } from "react-hot-toast";
import apiReq from "@/lib/apiReq";

const ReviewModal = ({ isOpen, onClose, onSubmit ,id }) => {
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Submitting your review...");
    try {
      if (review.rating === 0) {
        toast.error("Please select a rating");
        return;
      }
      if (!review.comment.trim()) {
        toast.error("Please write a review");
        return;
      }

      setIsSubmitting(true);

      const data = {
        Rating: review.rating,
        Comment: review.comment,
        AppointmentId: id,
      };

      const res = await apiReq.post("/appointment/add-review", data);

      toast.success("Thank you for your review!", { id: toastId });
      if (onSubmit) {
        onSubmit(review);
      }

      setReview({ rating: 0, comment: "" });
      onClose();
    } catch (error) {
      console.error("Review submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit review. Please try again.";

      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Write a Review
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Rating
            </p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({ ...review, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 dark:text-gray-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Your Review
            </label>
            <textarea
              id="review"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Share your experience..."
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
