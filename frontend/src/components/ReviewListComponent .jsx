import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Send, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

const ReviewListComponent = ({
  reviews,
  onReplySubmit,
  onReplyUpdate,
  onReplyDelete,
}) => {
  const { user } = useAuth();
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [sortedReviews, setSortedReviews] = useState([]);

  const isAdminOrDoctor =
    user?.role === "Doctor" || user?.role === "HospitalAdmin";

  // Sort reviews by date (newest first) and their replies
  useEffect(() => {
    const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    const withSortedReplies = sorted.map(review => ({
      ...review,
      replies: [...review.replies].sort((a, b) => new Date(b.date) - new Date(a.date))
    }));
    setSortedReviews(withSortedReplies);
  }, [reviews]);

  const handleSubmitReply = (reviewId) => {
    if (!replyText.trim()) {
      toast.error("Please write a reply");
      return;
    }

    if (editingReplyId) {
      // Update existing reply
      onReplyUpdate(reviewId, editingReplyId, replyText);
      setEditingReplyId(null);
    } else {
      // Submit new reply
      onReplySubmit(reviewId, replyText);
    }

    setReplyText("");
    setActiveReplyId(null);
  };

  const handleEditReply = (reviewId, reply) => {
    setActiveReplyId(reviewId);
    setEditingReplyId(reply.id);
    setReplyText(reply.text);
  };

  const handleDeleteReply = (reviewId, replyId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      onReplyDelete(reviewId, replyId);
    }
  };

  const hasReplied = (review) => {
    return review.replies.some(
      (reply) =>
        (reply.doctorId === user?.id && user?.role === "Doctor") ||
        (user?.role === "HospitalAdmin" && reply.adminId === user?.id)
    );
  };

  const getExistingReply = (review) => {
    return review.replies.find(
      (reply) =>
        (reply.doctorId === user?.id && user?.role === "Doctor") ||
        (user?.role === "HospitalAdmin" && reply.adminId === user?.id)
    );
  };

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Patient Reviews
      </h2>

      {sortedReviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No reviews yet.
        </p>
      ) : (
        sortedReviews.map((review) => {
          const existingReply = getExistingReply(review);
          const canReply = isAdminOrDoctor && !hasReplied(review);
          const canEdit = isAdminOrDoctor && hasReplied(review);

          return (
            <div
              key={review.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.patientImage}
                  alt={review.patientName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {review.patientName}
                    </h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 dark:text-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {review.date}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {review.comment}
                  </p>

                  {/* Show only the latest reply */}
                  {review.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                      <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg relative">
                        {(review.replies[0].doctorId === user?.id ||
                          review.replies[0].adminId === user?.id) && (
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() =>
                                handleEditReply(review.id, review.replies[0])
                              }
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit reply"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReply(review.id, review.replies[0].id)
                              }
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete reply"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={review.replies[0].doctorImage || review.replies[0].adminImage}
                            alt={review.replies[0].doctorName || review.replies[0].adminName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {review.replies[0].doctorName
                              ? `Dr. ${review.replies[0].doctorName}`
                              : review.replies[0].adminName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {review.replies[0].date}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 pl-10">
                          {review.replies[0].text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  {(canReply || (canEdit && activeReplyId === review.id)) && (
                    <div className="mt-4">
                      <textarea
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => {
                            setActiveReplyId(null);
                            setEditingReplyId(null);
                            setReplyText("");
                          }}
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitReply(review.id)}
                          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
                        >
                          {editingReplyId ? (
                            <>
                              <Edit className="w-4 h-4 mr-1" />
                              Update Reply
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-1" />
                              Send Reply
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reply Button (only if no existing reply) */}
                  {canReply && !activeReplyId && (
                    <button
                      onClick={() => setActiveReplyId(review.id)}
                      className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Reply to this review
                    </button>
                  )}

                  {/* Edit Button (only if has existing reply) */}
                  {canEdit && !activeReplyId && existingReply && (
                    <button
                      onClick={() => handleEditReply(review.id, existingReply)}
                      className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit your reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ReviewListComponent;