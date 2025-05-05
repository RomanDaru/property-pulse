import connectDB from "@/config/database";
import Review from "@/models/Review";
import { getSessionUser } from "@/utils/getSessionUser";
import { convertToSerializeableObject } from "@/utils/convertToSerializeableObject";

export const dynamic = "force-dynamic";

// GET /api/reviews/:id
// Get a specific review by ID
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { id } = params;
    const review = await Review.findById(id)
      .populate("user", "username image")
      .lean();

    if (!review) {
      return new Response("Review not found", { status: 404 });
    }

    // Convert to plain JavaScript object
    const serializableReview = convertToSerializeableObject(review);

    return Response.json(serializableReview);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/reviews/:id
// Update a review
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response("User ID is required", { status: 401 });
    }

    const { id } = params;
    const { userId } = sessionUser;
    const { rating, text } = await request.json();

    // Find the review
    const review = await Review.findById(id);

    if (!review) {
      return new Response("Review not found", { status: 404 });
    }

    // Verify ownership
    if (review.user.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Update review
    review.rating = rating || review.rating;
    review.text = text || review.text;

    await review.save();

    // Get the updated review with populated user
    const updatedReview = await Review.findById(id)
      .populate("user", "username image")
      .lean();

    // Convert to plain JavaScript object
    const serializableReview = convertToSerializeableObject(updatedReview);

    return Response.json(serializableReview);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/reviews/:id
// Delete a review
export const DELETE = async (request, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response("User ID is required", { status: 401 });
    }

    const { id } = params;
    const { userId } = sessionUser;

    // Find the review
    const review = await Review.findById(id);

    if (!review) {
      return new Response("Review not found", { status: 404 });
    }

    // Verify ownership
    if (review.user.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Delete review
    await review.deleteOne();

    return new Response("Review deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
