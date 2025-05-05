import connectDB from "@/config/database";
import Property from "@/models/Property";

export const dynamic = "force-dynamic";

export const POST = async (_, { params }) => {
  try {
    if (!params.id) {
      return new Response("Property ID is required", { status: 400 });
    }

    await connectDB();
    const propertyId = params.id;

    // First, check if the property exists
    const currentProperty = await Property.findById(propertyId);

    if (!currentProperty) {
      return new Response("Property Not Found", { status: 404 });
    }

    // If views is undefined, null, or not a number, set it to 0 first
    if (
      currentProperty.views === undefined ||
      currentProperty.views === null ||
      typeof currentProperty.views !== "number"
    ) {
      await Property.findByIdAndUpdate(propertyId, { $set: { views: 0 } });
    }

    // Use findOneAndUpdate to atomically update the view count
    // Use $set with a computed value to ensure it's at least 1
    const result = await Property.findByIdAndUpdate(
      propertyId,
      [
        {
          $set: {
            views: {
              $cond: [
                { $gt: ["$views", 0] }, // if views > 0
                { $add: ["$views", 1] }, // then add 1
                1, // else set to 1
              ],
            },
          },
        },
      ],
      // new: true returns the updated document
      { new: true }
    );

    if (!result) {
      return new Response("Property Not Found", { status: 404 });
    }

    // Make sure we're returning a serializable value
    const viewCount = result.views ? Number(result.views) : 1;

    return Response.json({ viewCount });
  } catch (error) {
    return new Response("Server Error", { status: 500 });
  }
};
