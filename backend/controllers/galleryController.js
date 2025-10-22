import Gallery from "../models/Gallery.js";
import path from "path";
import fs from "fs";

// Add new image
export const addImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const newImage = await Gallery.create({
      title: req.body.title || "Untitled",
      description: req.body.description || "",
      filePath: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all non-deleted images
export const getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find({ deleted: false }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get deleted images
export const getDeletedImages = async (req, res) => {
  try {
    const images = await Gallery.find({ deleted: true }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soft delete image
export const softDeleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.findByIdAndUpdate(id, { deleted: true });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Restore image
export const restoreImage = async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.findByIdAndUpdate(id, { deleted: false });
    res.json({ message: "Restored successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Permanent delete
export const permanentDeleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Gallery.findById(id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // Delete file from server
    const filePath = path.join("uploads", path.basename(image.filePath));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await image.deleteOne();
    res.json({ message: "Permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
