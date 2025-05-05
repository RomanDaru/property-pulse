import connectDB from "@/config/database";
import Review from "@/models/Review";
import { getSessionUser } from "@/utils/getSessionUser";
import { convertToSerializeableObject } from "@/utils/convertToSerializeableObject";

export const dynamic = "force-dynamic";

// GET /api/reviews
// Get all reviews (can be filtered by property ID via query parameter)
export const GET = async (request) => {
  try {
    await connectDB();

    // Get propertyId from query string if it exists
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    // If propertyId is provided, filter reviews by property
    const query = propertyId ? { property: propertyId } : {};

    const reviews = await Review.find(query)
      .populate("user", "username image")
      .sort({ createdAt: -1 })
      .lean();

    // Convert Mongoose documents to plain JavaScript objects
    const serializableReviews = convertToSerializeableObject(reviews);

    return Response.json(serializableReviews);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/reviews
// Create a new review
export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return Response.json(
        { message: "You must be logged in to leave a review" },
        { status: 401 }
      );
    }

    const { userId } = sessionUser;
    const { propertyId, rating, text } = await request.json();

    // Validate required fields
    if (!propertyId || !rating || !text) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({
      user: userId,
      property: propertyId,
    });

    if (existingReview) {
      return Response.json(
        { message: "You have already reviewed this property" },
        { status: 400 }
      );
    }

    // Create new review
    const review = new Review({
      user: userId,
      property: propertyId,
      rating,
      text,
    });

    await review.save();

    // Convert to plain JavaScript object
    const savedReview = await Review.findById(review._id)
      .populate("user", "username image")
      .lean();

    const serializableReview = convertToSerializeableObject(savedReview);

    return Response.json(
      { message: "Review added successfully", review: serializableReview },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
