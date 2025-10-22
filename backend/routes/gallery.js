import express from "express";
import multer from "multer";
import path from "path";
import Gallery from "../models/Gallery.js";

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Get all gallery images (active)
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find({ deleted: false }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get deleted images
router.get("/deleted", async (req, res) => {
  try {
    const deletedImages = await Gallery.find({ deleted: true }).sort({ createdAt: -1 });
    res.json(deletedImages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Upload new image
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    let filePath = "";
    let fileType = "";

    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype.split("/")[0];
    }

    const newImage = await Gallery.create({
      title,
      description,
      filePath,
      fileType,
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Soft delete
router.patch("/delete/:id", async (req, res) => {
  await Gallery.findByIdAndUpdate(req.params.id, { deleted: true });
  res.json({ message: "Image moved to deleted" });
});

// ✅ Restore image
router.patch("/restore/:id", async (req, res) => {
  await Gallery.findByIdAndUpdate(req.params.id, { deleted: false });
  res.json({ message: "Image restored" });
});

// ✅ Permanently delete
router.delete("/:id", async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ message: "Image permanently deleted" });
});

export default router;
