"use server";

import connectDB from "@/config/database";
import Review from "@/models/Review";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function addReview(previousState, formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return { error: "You must be logged in to leave a review" };
  }

  const { userId } = sessionUser;

  // Get form data
  const propertyId = formData.get("propertyId");
  const rating = parseInt(formData.get("rating"));
  const text = formData.get("text");

  // Validate data
  if (!propertyId || !rating || !text) {
    return { error: "Please fill in all fields" };
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5" };
  }

  try {
    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({
      user: userId,
      property: propertyId,
    });

    if (existingReview) {
      return { error: "You have already reviewed this property" };
    }

    // Create new review
    const newReview = new Review({
      user: userId,
      property: propertyId,
      rating,
      text,
    });

    const savedReview = await newReview.save();

    // Revalidate the property page to show the new review
    revalidatePath(`/properties/${propertyId}`);

    return {
      success: true,
      message: "Review added successfully",
      review: {
        _id: savedReview._id.toString(),
        rating: savedReview.rating,
        text: savedReview.text,
      },
    };
  } catch (error) {
    console.error("Error adding review:", error);
    return { error: error.message || "Error adding review" };
  }
}

export default addReview;
