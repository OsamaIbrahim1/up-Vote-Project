import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
  {
    likedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    likeDoneOnId: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" },
    onModel: {
      type: String,
      enum: ["Product", "Comment", "Reply"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Likes || mongoose.model("Likes", likesSchema);
