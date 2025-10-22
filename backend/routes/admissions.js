import express from "express"; 
import Admission from "../models/Admission.js";

const router = express.Router();

// 📩 Submit a new admission
router.post("/", async (req, res) => {
  try {
    const { name, selectedClass, dob, parentName, contact, address } = req.body;

    const newAdmission = new Admission({
      name,
      selectedClass,
      dob,
      parentName,
      contact,
      address,
    });

    await newAdmission.save();

    res.status(200).json({ message: "Admission submitted successfully!" });
  } catch (err) {
    console.error("❌ Error submitting admission:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📜 Get all admissions
router.get("/", async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json(admissions);
  } catch (err) {
    console.error("❌ Error fetching admissions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🗑️ Delete an admission by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmission = await Admission.findByIdAndDelete(id);

    if (!deletedAdmission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    res.status(200).json({ message: "Admission deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting admission:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
