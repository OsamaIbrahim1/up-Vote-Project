import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    replyOnId: { type: mongoose.Types.ObjectId, refPath: "onModel" },
    onModel: { type: String, enum: ["Comment", "Reply"] },
    numberOfLikes: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

replySchema.virtual("replies", {
  ref: "Reply",
  localField: "_id",
  foreignField: "replyOnId",
});
export default mongoose.models.Reply || mongoose.model("Reply", replySchema);
