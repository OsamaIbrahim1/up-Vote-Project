import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    numberOfLikes: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.virtual("replies", {
  ref: "Reply",
  localField: "_id",
  foreignField: "replyOnId",
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);
