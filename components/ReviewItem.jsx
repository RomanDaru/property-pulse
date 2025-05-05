"use client";

import { useState } from "react";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import profileDefault from "@/assets/images/profile.png";

const ReviewItem = ({ review, onReviewDeleted }) => {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review.text);
  const [editedRating, setEditedRating] = useState(review.rating);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle delete review
  const handleDeleteClick = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        toast.success("Review deleted successfully");
        // Call the parent component's callback to remove this review from the UI
        if (onReviewDeleted) {
          onReviewDeleted(review._id);
        }
      } else {
        const data = await res.json();
        toast.error(data.message || "Error deleting review");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit review
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: editedRating,
          text: editedText,
        }),
      });

      if (res.status === 200) {
        toast.success("Review updated successfully");
        // Update the review in the parent component
        review.text = editedText;
        review.rating = editedRating;
        setIsEditing(false);
      } else {
        const data = await res.json();
        toast.error(data.message || "Error updating review");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={
            i <= rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
          }
          size={16}
        />
      );
    }
    return stars;
  };

  return (
    <div className='bg-white dark:bg-purple-300 p-4 rounded-lg shadow-md mb-4'>
      <div className='flex items-center mb-2'>
        <div className='mr-2'>
          <Image
            src={review.user?.image || profileDefault}
            alt={review.user?.username || "User"}
            width={40}
            height={40}
            className='rounded-full'
          />
        </div>
        <div>
          <h3 className='text-lg font-semibold dark:text-black'>
            {review.user?.username || "Anonymous"}
          </h3>
          <div className='flex items-center'>
            <div className='flex mr-2'>{renderStars(review.rating)}</div>
            <span className='text-gray-500 dark:text-gray-700 text-sm'>
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        {/* Edit/Delete buttons - only show for the review author */}
        {session?.user?.id === review.user?._id && (
          <div className='ml-auto flex'>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className='text-blue-500 hover:text-blue-700 mr-2'
              aria-label='Edit review'>
              <FaEdit />
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className='text-red-500 hover:text-red-700'
              aria-label='Delete review'>
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className='mt-3'>
          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-900 mb-1'>
              Rating
            </label>
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setEditedRating(star)}
                  className='text-2xl focus:outline-none'>
                  <FaStar
                    className={
                      star <= editedRating ? "text-yellow-500" : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-900 mb-1'>
              Review
            </label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-purple-100'
              rows='3'
              required></textarea>
          </div>
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() => setIsEditing(false)}
              className='bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400'>
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <p className='text-gray-700 dark:text-black mt-2'>{review.text}</p>
      )}
    </div>
  );
};

export default ReviewItem;
