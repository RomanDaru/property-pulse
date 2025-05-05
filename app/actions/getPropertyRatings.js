"use server";

import connectDB from "@/config/database";
import Property from "@/models/Property";
import { Types } from "mongoose";

async function getPropertyRatings(propertyId) {
  try {
    await connectDB();

    // Convert string ID to MongoDB ObjectId
    const objectId = new Types.ObjectId(propertyId);

    // Get average rating and review count
    const ratingData = await Property.getAverageRating(objectId);

    return {
      success: true,
      averageRating: ratingData.averageRating || 0,
      reviewCount: ratingData.reviewCount || 0,
    };
  } catch (error) {
    console.error("Error getting property ratings:", error);
    return {
      success: false,
      error: "Failed to get property ratings",
    };
  }
}

export default getPropertyRatings;
