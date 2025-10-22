import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  selectedClass: { type: String, required: true },
  dob: { type: Date, required: true },
  parentName: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
