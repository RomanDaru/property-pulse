"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const AddReviewForm = ({ propertyId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!text.trim()) {
      toast.error("Please enter a review");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create form data
      const formData = new FormData();
      formData.append("propertyId", propertyId);
      formData.append("rating", rating);
      formData.append("text", text);

      // Submit the review
      const response = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          propertyId,
          rating,
          text,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        toast.success("Review added successfully");

        // Reset form
        setRating(0);
        setText("");

        // Show thank you message
        setShowThankYou(true);

        // After 2 seconds, refresh the reviews
        setTimeout(() => {
          setShowThankYou(false);

          // Call the callback to refresh reviews
          if (onReviewAdded) {
            onReviewAdded();
          }
        }, 2000);
      } else {
        // Show error message
        toast.error(data.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the review was submitted successfully, show a thank you message
  if (showThankYou) {
    return (
      <div className='bg-green-50 dark:bg-green-200 p-4 rounded-md text-center'>
        <h3 className='text-xl font-semibold text-green-800 mb-2'>
          Thank You!
        </h3>
        <p className='text-green-700 dark:text-green-900'>
          Your review has been submitted successfully.
        </p>
        <p className='text-green-700 dark:text-green-900 mt-2'>
          The page will refresh in a moment to show your review.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-purple-300 p-6 rounded-lg shadow-md mb-6'>
      <h3 className='text-xl font-semibold mb-4 dark:text-black'>
        Leave a Review
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className='mb-4'>
          <label className='block text-gray-700 dark:text-gray-900 mb-2'>
            Rating
          </label>
          <div className='flex'>
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  type='button'
                  key={starValue}
                  className={`text-3xl focus:outline-none ${
                    starValue <= (hover || rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}>
                  <FaStar />
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Text */}
        <div className='mb-4'>
          <label
            htmlFor='text'
            className='block text-gray-700 dark:text-gray-900 mb-2'>
            Your Review
          </label>
          <textarea
            id='text'
            rows='4'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-purple-100'
            placeholder='Share your experience with this property...'
            required></textarea>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isSubmitting || rating === 0}
          className={`px-4 py-2 rounded-md ${
            isSubmitting || rating === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
