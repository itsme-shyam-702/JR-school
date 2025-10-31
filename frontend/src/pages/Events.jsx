import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import Swal from "sweetalert2";
import api from "../api/api"; // keep your existing api module

export default function Events() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const isAdmin = userEmail === "sssshyam702@gmail.com";

  const [events, setEvents] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const [selected, setSelected] = useState([]); // for multi-delete (admin)
  const [showDeleted, setShowDeleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null); // holds ev._id of open dropdown

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    file: null,
  });

  // Fetch events and deleted on mount
  useEffect(() => {
    fetchEvents();
    fetchDeletedEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/");
      setEvents(res.data);
    } catch (err) {
      console.error("fetchEvents error", err);
    }
  };

  const fetchDeletedEvents = async () => {
    try {
      const res = await api.get("/deleted");
      setRecentlyDeleted(res.data);
    } catch (err) {
      console.error("fetchDeletedEvents error", err);
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setNewEvent((prev) => ({ ...prev, file }));
  };

  // Add event (admin only)
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please provide both title and date!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("date", newEvent.date);
      if (newEvent.file) formData.append("file", newEvent.file);

      const res = await api.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEvents((prev) => [res.data, ...prev]);
      setNewEvent({ title: "", description: "", date: "", file: null });
      setShowForm(false);

      Swal.fire({
        icon: "success",
        title: "Event Added!",
        text: "Your event has been uploaded successfully.",
        confirmButtonColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("handleAddEvent error", err);
      Swal.fire("Error", "Failed to add event.", "error");
    }
  };

  // // Multi-select toggle (used by admin for bulk delete)
  // const toggleSelect = (id) => {
  //   setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  // };

  // Confirm wrapper
  const confirmDelete = async (message, onConfirm) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      await onConfirm();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Event deleted successfully.",
        confirmButtonColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Soft delete (move to recently deleted)
  const handleDeleteSingle = (id) => {
    confirmDelete("Move this event to trash?", async () => {
      await api.patch(`/delete/${id}`);
      await fetchEvents();
      await fetchDeletedEvents();
    });
  };

  // Bulk delete selected (admin)
  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    confirmDelete(`Delete ${selected.length} selected event(s)?`, async () => {
      await Promise.all(selected.map((id) => api.patch(`/delete/${id}`)));
      await fetchEvents();
      await fetchDeletedEvents();
      setSelected([]);
    });
  };

  // Restore from trash
  const handleRestore = async (id) => {
    await api.patch(`/restore/${id}`);
    await fetchEvents();
    await fetchDeletedEvents();

    Swal.fire({
      icon: "success",
      title: "Restored!",
      text: "Event has been restored successfully.",
      confirmButtonColor: "#10b981",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Permanent delete (admin only)
  const handlePermanentDelete = (id) => {
    confirmDelete(
      "Permanently delete this event? This cannot be undone.",
      async () => {
        await api.delete(`/${id}`);
        await fetchDeletedEvents();
      }
    );
  };

  // Open any file in new tab
  const openFileInNewTab = (filePath) => {
    if (!filePath) return;
    const fullUrl = `https://jr-school-67nt.onrender.com${filePath}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  // Share (native Web Share if available; else copy link)
  const handleShare = async (ev) => {
    const link = ev.filePath ? `https://jr-school-67nt.onrender.com${ev.filePath}` : window.location.href;
    const shareData = {
      title: ev.title,
      text: ev.description || ev.title,
      url: link,
    };

    try {
      if (navigator.share) {
        // Try to download file and share as file if browser supports files in share
        if (ev.filePath) {
          try {
            const response = await fetch(link);
            const blob = await response.blob();
            const file = new File([blob], (ev.filePath.split("/").pop() || ev.title), { type: blob.type });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({ files: [file], title: ev.title, text: ev.description || ev.title });
              setMenuOpen(null);
              return;
            }
          } catch (err) {
            // fetching file failed — fallback to share URL
            console.warn("fetch for native file-share failed, falling back to url:", err);
          }
        }
        await navigator.share(shareData);
      } else {
        // fallback: copy link
        await navigator.clipboard.writeText(link);
        Swal.fire({
          icon: "info",
          title: "Link Copied!",
          text: "Event link copied to clipboard.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("handleShare:", err);
      // final fallback: copy link and alert
      try {
        await navigator.clipboard.writeText(link);
        Swal.fire({
          icon: "info",
          title: "Link Copied!",
          text: "Event link copied to clipboard.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (e) {
        console.error("clipboard fallback failed", e);
      }
    } finally {
      setMenuOpen(null);
    }
  };

  // Whatsapp share (opens new tab with prefilled message)
  // const handleWhatsAppShare = (ev) => {
  //   const link = ev.filePath ? `https://jr-school-67nt.onrender.com${ev.filePath}` : "";
  //   const text = encodeURIComponent(`${ev.title}\n\n${ev.description || ""}\n\n${link}`);
  //   const waUrl = `https://wa.me/?text=${text}`;
  //   window.open(waUrl, "_blank", "noopener,noreferrer");
  //   setMenuOpen(null);
  // };

  // Email share (mailto)
  // const handleEmailShare = (ev) => {
  //   const link = ev.filePath ? `https://jr-school-67nt.onrender.com${ev.filePath}` : "";
  //   const subject = encodeURIComponent(ev.title || "Event");
  //   const body = encodeURIComponent(`${ev.description || ""}\n\n${link}`);
  //   window.location.href = `mailto:?subject=${subject}&body=${body}`;
  //   setMenuOpen(null);
  // };

  return (
    <section className="bg-white text-gray-800 min-h-screen py-10 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-1">School Events & Circulars</h1>
            <p className="text-slate-500 text-sm">Add, view, and manage all school events easily.</p>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0 items-center">
            {isAdmin && selected.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
                type="button"
              >
                🗑 Delete ({selected.length})
              </button>
            )}

            {isAdmin && (
              <button onClick={() => setShowForm(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow transition" type="button">
                Add Event
              </button>
            )}

            {isAdmin && (
              <button onClick={() => setShowDeleted((s) => !s)} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow transition" type="button">
                {showDeleted ? "Hide" : "Recently Deleted"}
              </button>
            )}
          </div>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {events.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-8">No events yet — {isAdmin ? 'click “Add Event” to create one.' : 'check back later.'}</div>
          )}

          {events.map((ev) => {
            const isImage = ev.fileType === "image";
            const isPdf = ev.fileType === "application" || ev.fileType === "pdf";
            const fileUrl = ev.filePath ? `https://jr-school-67nt.onrender.com${ev.filePath}` : "";

            return (
              <div
                key={ev._id}
                className={`relative bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden`}
              >
                {/* Select overlay (admin only)
                {isAdmin && (
                  <div className="absolute top-2 left-2 z-20">
                    <input
                      type="checkbox"
                      checked={selected.includes(ev._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(ev._id);
                      }}
                      aria-label="Select event"
                    />
                  </div>
                )} */}

                {/* Clickable preview area */}
                <div
                  className="h-40 bg-gray-100 relative cursor-pointer"
                  onClick={() => openFileInNewTab(ev.filePath)}
                >
                  {isImage && ev.filePath ? (
                    <img src={fileUrl} alt={ev.title} className="w-full h-full object-cover" />
                  ) : isPdf && ev.filePath ? (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-xs text-slate-600">PDF / Document</div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400 text-sm">No file</div>
                  )}

                  {/* Three-dot button (no white patch behind it) */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === ev._id ? null : ev._id);
                      }}
                      aria-label="Open options"
                      className="p-1 rounded-full hover:bg-slate-200"
                      type="button"
                    >
                      ⋮
                    </button>

                    {/* Dropdown */}
                    {menuOpen === ev._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-md text-sm z-50"
                      >
                        <button onClick={() => handleShare(ev)} className="w-full text-left px-3 py-2 hover:bg-gray-100" type="button">
                          🔗 Share
                        </button>
                        {/* <button onClick={() => handleWhatsAppShare(ev)} className="w-full text-left px-3 py-2 hover:bg-gray-100" type="button">
                          💬 WhatsApp
                        </button>
                        <button onClick={() => handleEmailShare(ev)} className="w-full text-left px-3 py-2 hover:bg-gray-100" type="button">
                          ✉️ Email
                        </button> */}

                        {isAdmin && (
                          <button
                            onClick={() => {
                              handleDeleteSingle(ev._id);
                              setMenuOpen(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                            type="button"
                          >
                            🗑 Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-900 truncate mb-1">{ev.title}</h3>
                  <p className="text-xs text-slate-500 mb-1">{new Date(ev.date).toDateString()}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-1">{ev.description || "—"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Form (Admin Only) */}
      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.25 }} className="fixed bottom-10 right-10 bg-white border border-slate-300 p-5 shadow-2xl rounded-xl w-80 z-50">
            <h2 className="text-lg font-semibold mb-3 text-slate-800">Add New Event</h2>

            <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Title" className="w-full border border-slate-300 px-2 py-1 mb-2 rounded" />
            <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} className="w-full border border-slate-300 px-2 py-1 mb-2 rounded" />
            <textarea name="description" value={newEvent.description} onChange={handleInputChange} placeholder="Description" className="w-full border border-slate-300 px-2 py-1 mb-2 rounded" />
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="w-full border border-slate-300 px-2 py-1 mb-3 rounded" />

            <div className="flex justify-between">
              <button onClick={handleAddEvent} className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700" type="button">Upload</button>
              <button onClick={() => setShowForm(false)} className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100" type="button">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently Deleted (Admin only) */}
      <AnimatePresence>
        {isAdmin && showDeleted && recentlyDeleted.length > 0 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.3 }} className="fixed bottom-0 left-0 right-0 bg-slate-100 border-t border-slate-300 py-3 px-4 shadow-lg overflow-x-auto flex gap-3">
            {recentlyDeleted.map((ev) => (
              <div key={ev._id} className="relative flex-shrink-0 w-28 h-20">
                {ev.filePath && ev.fileType === "image" ? (
                  <img src={`https://jr-school-67nt.onrender.com${ev.filePath}`} alt={ev.title} className="w-full h-full object-cover border" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">PDF / No File</div>
                )}
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition text-xs text-white">
                  <button onClick={() => handleRestore(ev._id)} className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded mb-1">♻ Restore</button>
                  <button onClick={() => handlePermanentDelete(ev._id)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded">🗑 Delete</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
