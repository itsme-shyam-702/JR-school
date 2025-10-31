import express from "express";
import Admission from "../models/Admission.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

const validateFields = (fields) =>
  Object.values(fields).every((v) => v && v.toString().trim() !== "");

// 📩 Create admission (any signed-in visitor/staff/admin)
router.post("/", requireAuth, requireRole(["visitor", "staff", "admin"]), async (req, res) => {
  try {
    const { name, selectedClass, dob, parentName, contact, address } = req.body;
    if (!validateFields({ name, selectedClass, dob, parentName, contact, address }))
      return res.status(400).json({ message: "All fields are required" });

    const newAdmission = await Admission.create({
      name,
      selectedClass,
      dob,
      parentName,
      contact,
      address,
    });

    res.status(201).json({ message: "Admission submitted successfully!", data: newAdmission });
  } catch (err) {
    console.error("Error submitting admission:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📜 Get all admissions (staff/admin)
router.get("/", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🗑️ Delete admission (staff/admin)
router.delete("/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const deleted = await Admission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Admission deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
