import express from "express";
import multer from "multer";
import Gallery from "../models/Gallery.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Get all
router.get("/", requireAuth, requireRole(["visitor", "staff", "admin"]), async (req, res) => {
  const images = await Gallery.find({ deleted: false }).sort({ createdAt: -1 });
  res.json(images);
});

// ✅ Get deleted
router.get("/deleted", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  const deleted = await Gallery.find({ deleted: true });
  res.json(deleted);
});

// ✅ Upload new
router.post("/", requireAuth, requireRole(["staff", "admin"]), upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : "";
    const fileType = req.file ? req.file.mimetype.split("/")[0] : "";
    const image = await Gallery.create({ title, description, filePath, fileType });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Soft delete
router.patch("/delete/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Gallery.findByIdAndUpdate(req.params.id, { deleted: true });
  res.json({ message: "Image soft deleted" });
});

// ✅ Restore
router.patch("/restore/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Gallery.findByIdAndUpdate(req.params.id, { deleted: false });
  res.json({ message: "Image restored" });
});

// ✅ Permanent delete
router.delete("/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ message: "Image permanently deleted" });
});

export default router;
