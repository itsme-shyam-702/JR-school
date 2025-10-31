import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useUser } from "@clerk/clerk-react"; // 👈 Import from Clerk
import api from "../api/gallery";

// ✅ Toast instance
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: "#fff",
  color: "#333",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export default function Gallery() {
  const { user } = useUser(); // 👈 Clerk user
  const [images, setImages] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newImage, setNewImage] = useState({
    file: null,
    title: "",
    description: "",
  });

  // ✅ Determine user roles
  const userRole = user?.publicMetadata?.role; // Example: "admin" or "staff"
  const isAdminOrStaff = userRole === "admin" || userRole === "staff";

  useEffect(() => {
    fetchImages();
    fetchDeletedImages();
  }, []);

  const fetchImages = async () => {
    const res = await api.getAll();
    setImages(res.data);
  };

  const fetchDeletedImages = async () => {
    const res = await api.getDeleted();
    setRecentlyDeleted(res.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewImage((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setNewImage((prev) => ({ ...prev, file }));
  };

  const handleAddImage = async () => {
    if (!newImage.file) {
      Swal.fire("No File!", "Please select an image file.", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", newImage.file);
      formData.append("title", newImage.title || "Untitled");
      formData.append("description", newImage.description || "");

      const res = await api.add(formData);
      setImages((prev) => [res.data, ...prev]);
      setNewImage({ file: null, title: "", description: "" });
      setShowForm(false);
      document.getElementById("fileInput").value = "";

      Toast.fire({
        icon: "success",
        title: "Image uploaded successfully!",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to upload image.", "error");
    }
  };

  const handleDeleteSingle = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This image will be moved to Recently Deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.softDelete(id);
        fetchImages();
        fetchDeletedImages();
        setSelected((prev) => prev.filter((x) => x !== id));
        Toast.fire({
          icon: "success",
          title: "Image moved to Recently Deleted",
        });
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;

    Swal.fire({
      title: "Delete selected images?",
      text: `${selected.length} image(s) will be moved to Recently Deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Promise.all(selected.map((id) => api.softDelete(id)));
        fetchImages();
        fetchDeletedImages();
        setSelected([]);
        Toast.fire({
          icon: "success",
          title: "Selected images deleted successfully!",
        });
      }
    });
  };

  const handleRestore = async (id) => {
    await api.restore(id);
    fetchImages();
    fetchDeletedImages();
    Toast.fire({
      icon: "success",
      title: "Image restored successfully!",
    });
  };

  const handlePermanentDelete = async (id) => {
    Swal.fire({
      title: "Permanently delete?",
      text: "This cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Delete Permanently",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.permanentDelete(id);
        fetchDeletedImages();
        Toast.fire({
          icon: "success",
          title: "Image permanently removed!",
        });
      }
    });
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-white text-gray-800 min-h-screen py-10 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-1">
              School Gallery
            </h1>
            <p className="text-slate-500 text-sm">
              View, add, and manage school images easily
            </p>
          </div>

          {/* ✅ Only show these for Admin/Staff */}
          {isAdminOrStaff && (
            <div className="flex gap-3 mt-4 sm:mt-0">
              {selected.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
                >
                  Delete ({selected.length})
                </button>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow transition"
              >
                Add Image
              </button>
              <button
                onClick={() => setShowDeleted((s) => !s)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow transition"
              >
                {showDeleted ? "Hide" : "Recently Deleted"}
              </button>
            </div>
          )}
        </div>

        {/* Gallery */}
        <div
          className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-1 space-y-1"
          style={{ columnFill: "balance" }}
        >
          {images.map((img) => (
            <div
              key={img._id}
              className={`relative overflow-hidden hover:opacity-90 transition cursor-pointer break-inside-avoid ${
                selected.includes(img._id) ? "ring-4 ring-sky-500" : ""
              }`}
              onClick={() => toggleSelect(img._id)}
            >
              <img
                src={`https://jr-school-67nt.onrender.com${img.filePath}`}
                alt={img.title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-1 text-xs">
                <p className="font-semibold">{img.title}</p>
                {img.description && (
                  <p className="opacity-90">{img.description}</p>
                )}
              </div>

              {/* ✅ Delete button only for Admin/Staff */}
              {isAdminOrStaff && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSingle(img._id);
                  }}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Form */}
      <AnimatePresence>
        {isAdminOrStaff && showForm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-10 right-10 bg-white border border-slate-300 p-5 shadow-2xl rounded-xl w-80 z-50"
          >
            <h2 className="text-lg font-semibold mb-3 text-slate-800">
              Add New Image
            </h2>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-slate-300 px-2 py-1 mb-2 rounded"
            />
            <input
              type="text"
              name="title"
              value={newImage.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full border border-slate-300 px-2 py-1 mb-2 rounded"
            />
            <input
              type="text"
              name="description"
              value={newImage.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full border border-slate-300 px-2 py-1 mb-3 rounded"
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddImage}
                className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
              >
                Upload
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently Deleted */}
      <AnimatePresence>
        {isAdminOrStaff && showDeleted && recentlyDeleted.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-100 border-t border-slate-300 py-3 px-4 shadow-lg overflow-x-auto flex gap-3"
          >
            {recentlyDeleted.map((img) => (
              <div key={img._id} className="relative flex-shrink-0 w-28 h-20">
                <img
                  src={`https://jr-school-67nt.onrender.com${img.filePath}`}
                  alt={img.title}
                  className="w-full h-full object-cover border"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition text-xs text-white">
                  <button
                    onClick={() => handleRestore(img._id)}
                    className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded mb-1"
                  >
                    ♻ Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(img._id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
