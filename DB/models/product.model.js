import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, default: "no caption" },
    numberOfLikes: { type: Number, default: 0, min: 0 },
    Images: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
        folderId: { type: String, required: true, unique: true },
      },
    ],
    addedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    numComments: { type: Number, default: 0 },
  },
  { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "productId",
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
