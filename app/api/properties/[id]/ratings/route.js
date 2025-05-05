import connectDB from "@/config/database";
import Property from "@/models/Property";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

// GET /api/properties/:id/ratings
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const propertyId = params.id;

    // Convert string ID to MongoDB ObjectId
    const objectId = new Types.ObjectId(propertyId);

    // Get average rating and review count
    const ratingData = await Property.getAverageRating(objectId);

    return Response.json(ratingData);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
