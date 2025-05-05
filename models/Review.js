import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    // The user who wrote the review
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The property being reviewed
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    // Rating (1-5 stars)
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    // Review text
    text: {
      type: String,
      required: [true, "Review text is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews (one review per user per property)
ReviewSchema.index({ user: 1, property: 1 }, { unique: true });

const Review = models.Review || model("Review", ReviewSchema);

export default Review;
