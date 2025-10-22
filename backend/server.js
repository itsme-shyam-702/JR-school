import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/gallery.js";
import admissionRoutes from "./routes/admissions.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/admission", admissionRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(frontendBuildPath));

  // Regex-based catch-all route to fix refresh issues
  app.get(/.*/, function (_req, res) {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  // Test route for development
  app.get("/", (_req, res) => res.send("Server is running"));
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
