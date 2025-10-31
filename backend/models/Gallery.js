import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    filePath: String,
    fileType: String,
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
