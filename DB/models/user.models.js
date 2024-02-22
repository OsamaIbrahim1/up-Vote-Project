import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      max: 15,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 16,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["female", "male"],
      default: "male",
      required: true,
    },
    role: {
      type: String,
      enum: [systemRoles.ADMIN, systemRoles.USER],
      default: systemRoles.USER,
      required: true,
    },
    Image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true, unique: true },
    },
    folderId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
