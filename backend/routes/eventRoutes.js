import express from "express";
import multer from "multer";
import path from "path";
import Event from "../models/Event.js";

const router = express.Router();

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ GET active events
router.get("/", async (req, res) => {
  const events = await Event.find({ deleted: false }).sort({ date: -1 });
  res.json(events);
});

// ✅ GET deleted events
router.get("/deleted", async (req, res) => {
  const events = await Event.find({ deleted: true }).sort({ date: -1 });
  res.json(events);
});

// ✅ POST add new event
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    let filePath = "";
    let fileType = "";

    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype.split("/")[0];
    }

    const event = await Event.create({
      title,
      description,
      date,
      filePath,
      fileType,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PATCH soft delete
router.patch("/delete/:id", async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { deleted: true });
  res.json({ message: "Event moved to deleted" });
});

// ✅ PATCH restore event
router.patch("/restore/:id", async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { deleted: false });
  res.json({ message: "Event restored" });
});

// ✅ DELETE permanent delete
router.delete("/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event permanently deleted" });
});

export default router;
