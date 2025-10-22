import express from "express";
import Admission from "../models/Admission.js";

const router = express.Router();

// Submit admission form
router.post("/", async (req, res) => {
  try {
    const { name, selectedClass, dob, parentName, contact, address } = req.body;
    const newAdmission = new Admission({ name, selectedClass, dob, parentName, contact, address });
    await newAdmission.save();
    res.status(200).json({ message: "Admission submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all admissions
router.get("/", async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json(admissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
