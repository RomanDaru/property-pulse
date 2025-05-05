import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/properties
export const GET = async (request) => {
  try {
    await connectDB();

    const page = request.nextUrl.searchParams.get("page") || 1;
    const pageSize = request.nextUrl.searchParams.get("pageSize") || 6;
    const sortBy = request.nextUrl.searchParams.get("sortBy") || "";

    const skip = (page - 1) * pageSize;

    // Build sort options based on sortBy parameter
    let sortOptions = {};

    switch (sortBy) {
      case "price_asc":
        sortOptions = {
          "rates.monthly": 1,
          "rates.weekly": 1,
          "rates.nightly": 1,
        };
        break;
      case "price_desc":
        sortOptions = {
          "rates.monthly": -1,
          "rates.weekly": -1,
          "rates.nightly": -1,
        };
        break;
      case "rating_desc":
        // For rating, we'll need to use aggregation pipeline
        break;
      case "beds_desc":
        sortOptions = { beds: -1 };
        break;
      case "baths_desc":
        sortOptions = { baths: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 }; // Default sort by newest
    }

    const total = await Property.countDocuments({});
    // Handle special case for rating sort
    if (sortBy === "rating_desc") {
      // Use aggregation to get average ratings
      const properties = await Property.aggregate([
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "property",
            as: "reviews",
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$reviews.rating" },
          },
        },
        {
          $sort: { averageRating: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: parseInt(pageSize),
        },
      ]);

      return Response.json({
        total,
        properties,
      });
    } else {
      // Normal sort
      const properties = await Property.find({})
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(pageSize));

      return Response.json({
        total,
        properties,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    const formData = await request.formData();

    // Access all values from amenities and images
    const amenities = formData.getAll("amenities");

    const images = formData
      .getAll("images")
      .filter((image) => image.name !== "");

    // Create propertyData object for database
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly."),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    // Upload image(s) to Cloudinary
    // NOTE: this will be an array of strings, not a array of Promises
    // So imageUploadPromises has been changed to imageUrls to more
    // declaratively represent it's type.

    const imageUrls = [];

    for (const imageFile of images) {
      const imageBuffer = await imageFile.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      // Convert the image data to base64
      const imageBase64 = imageData.toString("base64");

      // Make request to upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "propertypulse",
        }
      );

      imageUrls.push(result.secure_url);
    }

    // NOTE: here there is no need to await the resolution of
    // imageUploadPromises as it's not a array of Promises it's an array of
    // strings, additionally we should not await on every iteration of our loop.

    propertyData.images = imageUrls;

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );
  } catch (error) {
    return new Response("Failed to add property", { status: 500 });
  }
};
