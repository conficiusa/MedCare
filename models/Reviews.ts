import { IReview } from "@/lib/definitions";
import { Types } from "mongoose";
import { models, Schema, model } from "mongoose";

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true }, // Reference to user
    doctorId: { type: Types.ObjectId, ref: "Doctor", required: true }, // Reference to doctor
    rating: { type: Number, required: true, min: 1, max: 5 }, // Ratings from 1 to 5
    comment: { type: String, trim: true }, // Optional comment
    createdAt: { type: Date, default: Date.now }, // Timestamp
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId.toString();
        ret.doctorId = ret.doctorId.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ReviewSchema?.index({ doctorId: 1});
const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
