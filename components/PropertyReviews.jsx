"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaStar } from "react-icons/fa";
import ReviewItem from "./ReviewItem";
import AddReviewForm from "./AddReviewForm";
import Spinner from "./Spinner";

const PropertyReviews = ({ propertyId }) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Function to fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?propertyId=${propertyId}`, {
        // Add cache: 'no-store' to prevent caching
        cache: "no-store",
        // Add a timestamp to bust cache
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(data);

        // Calculate average rating
        if (data.length > 0) {
          const total = data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating((total / data.length).toFixed(1));
        } else {
          setAverageRating(0);
        }

        // Check if current user has already reviewed
        if (session?.user?.id) {
          const userReview = data.find(
            (review) => review.user?._id === session.user.id
          );
          setUserHasReviewed(!!userReview);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews when component mounts or propertyId/session changes
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, session]);

  // Handle review deletion
  const handleReviewDeleted = (reviewId) => {
    // If the current user's review was deleted, update the state
    if (session?.user?.id) {
      const deletedReview = reviews.find(
        (review) =>
          review._id === reviewId && review.user?._id === session.user.id
      );

      if (deletedReview) {
        setUserHasReviewed(false);
      }
    }

    // Refresh the reviews list
    fetchReviews();
  };

  // Render stars for average rating
  const renderStars = (rating) => {
    return (
      <div className='flex'>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={
              star <= Math.round(rating)
                ? "text-yellow-500"
                : "text-gray-300 dark:text-gray-600"
            }
            size={20}
          />
        ))}
      </div>
    );
  };

  if (loading) return <Spinner loading={loading} />;

  return (
    <div className='mt-8'>
      <h2 className='text-2xl font-bold mb-6 dark:text-white'>Reviews</h2>

      {/* Rating Summary */}
      <div className='bg-white dark:bg-purple-300 p-4 rounded-lg shadow-md mb-6'>
        <div className='flex items-center'>
          {averageRating > 0 ? (
            <>
              <div className='text-4xl font-bold mr-4 dark:text-black'>
                {averageRating}
              </div>
              <div>
                {renderStars(averageRating)}
                <p className='text-gray-600 dark:text-gray-800 mt-1'>
                  Based on {reviews.length} review
                  {reviews.length !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          ) : (
            <div className='flex items-center'>
              <div className='text-gray-600 dark:text-gray-800 flex items-center'>
                <span className='text-2xl mr-2'>⭐</span>
                <p>No reviews yet</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Form - only show if user is logged in and hasn't reviewed yet */}
      {session?.user && !userHasReviewed && (
        <AddReviewForm
          propertyId={propertyId}
          onReviewAdded={() => {
            // Force a complete refresh of the reviews list
            setReviews([]);
            setUserHasReviewed(true); // Immediately hide the form
            fetchReviews(); // Fetch the updated reviews
          }}
        />
      )}

      {/* Reviews List */}
      <div className='space-y-4'>
        {reviews.length === 0 ? (
          <p className='text-gray-500 dark:text-gray-700 bg-white dark:bg-purple-300 p-4 rounded-lg shadow-md'>
            This property has no reviews yet. Be the first to leave a review!
          </p>
        ) : (
          reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              onReviewDeleted={handleReviewDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyReviews;
