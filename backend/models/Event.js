import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  filePath: String,
  fileType: String,
  deleted: { type: Boolean, default: false },
});

export default mongoose.model("Event", eventSchema);
