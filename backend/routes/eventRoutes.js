import express from "express";
import multer from "multer";
import path from "path";
import Event from "../models/Event.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Public (visitor/staff/admin)
router.get("/", requireAuth, requireRole(["visitor", "staff", "admin"]), async (req, res) => {
  const events = await Event.find({ deleted: false }).sort({ date: -1 });
  res.json(events);
});

// ✅ Deleted (staff/admin)
router.get("/deleted", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  const events = await Event.find({ deleted: true });
  res.json(events);
});

// ✅ Add new (staff/admin)
router.post("/", requireAuth, requireRole(["staff", "admin"]), upload.single("file"), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : "";
    const fileType = req.file ? req.file.mimetype.split("/")[0] : "";

    const event = await Event.create({ title, description, date, filePath, fileType });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Soft delete
router.patch("/delete/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { deleted: true });
  res.json({ message: "Event soft deleted" });
});

// ✅ Restore
router.patch("/restore/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { deleted: false });
  res.json({ message: "Event restored" });
});

// ✅ Permanent delete
router.delete("/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event permanently deleted" });
});

export default router;
