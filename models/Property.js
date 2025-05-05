import { Schema, model, models } from "mongoose";
import Review from "./Review";

const PropertySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    location: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipcode: {
        type: String,
      },
    },
    beds: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    square_feet: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    rates: {
      nightly: {
        type: Number,
      },
      weekly: {
        type: Number,
      },
      monthly: {
        type: Number,
      },
    },
    seller_info: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    images: [
      {
        type: String,
      },
    ],
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for reviews
PropertySchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "property",
  justOne: false,
});

// Static method to get average rating
PropertySchema.statics.getAverageRating = async function (propertyId) {
  const obj = await this.aggregate([
    {
      $match: { _id: propertyId },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "property",
        as: "reviews",
      },
    },
    {
      $project: {
        averageRating: { $avg: "$reviews.rating" },
        reviewCount: { $size: "$reviews" },
      },
    },
  ]);

  return obj[0] || { averageRating: 0, reviewCount: 0 };
};

const Property = models.Property || model("Property", PropertySchema);

export default Property;
