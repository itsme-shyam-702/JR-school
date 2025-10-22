import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/gallery.js";  // ✅ corrected name
import admissionRoutes from "./routes/admissions.js";
import path from "path";
import { fileURLToPath } from "url";
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

// Routes
app.use("/api/admission", admissionRoutes);
app.use("/api/gallery", galleryRoutes);  // ✅ correct import name
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);

// Test route
app.get("/", (req, res) => res.send("Server is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
