import { useEffect, useState } from "react";
import api from "../api/contact";
import Swal from "sweetalert2";
import {
  MoreVertical,
  FolderMinus,
  Trash2,
  ArrowLeft,
  RotateCw,
  XCircle,
  MailX,
} from "lucide-react";

function ContactDashboard() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.getMessages();
        const msgs = res.data.map((m) => {
          const read = JSON.parse(localStorage.getItem(`read-${m._id}`)) || false;
          return {
            ...m,
            read,
            deleted: m.deleted || false,
            new: !read,
            unread: !read,
          };
        });
        msgs.sort((a, b) => {
          if (a.read === b.read)
            return new Date(b.createdAt) - new Date(a.createdAt);
          return a.read ? 1 : -1;
        });
        setMessages(msgs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const openMessage = (msg) => {
    if (multiSelectMode) {
      toggleSelect(msg._id);
      return;
    }
    if (showTrash) return;
    setSelectedMessage(msg);
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msg._id
          ? { ...m, read: true, new: false, unread: false }
          : m
      )
    );
    localStorage.setItem(`read-${msg._id}`, true);
  };

  const markAsUnread = (id) => {
    setMessages((prev) =>
      prev.map((m) =>
        m._id === id ? { ...m, read: false, unread: true, new: true } : m
      )
    );
    localStorage.setItem(`read-${id}`, false);
    setSelectedMessage(null);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Soft delete single
  const deleteSingle = async () => {
    if (!selectedMessage) return;
    const confirm = await Swal.fire({
      title: "Move to Trash?",
      text: "This message will be moved to trash.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, move it",
    });
    if (!confirm.isConfirmed) return;
    try {
      await api.softDeleteMessage(selectedMessage._id);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === selectedMessage._id ? { ...m, deleted: true } : m
        )
      );
      setSelectedMessage(null);
      Swal.fire("Moved!", "Message moved to trash.", "success");
    } catch (err) {
      console.error(err);
    }
  };

  // Restore single
  const restoreSingle = async (id) => {
    try {
      await api.restoreMessage(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, deleted: false } : m))
      );
      Swal.fire("Restored!", "Message has been restored.", "success");
    } catch (err) {
      console.error(err);
    }
  };

  // Permanently delete one
  const permanentDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete permanently?",
      text: "This cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
      Swal.fire("Deleted!", "Message permanently deleted.", "success");
    } catch (err) {
      console.error(err);
    }
  };

  // Multi actions
  const deleteSelected = async () => {
    const confirm = await Swal.fire({
      title: "Move selected to Trash?",
      text: `${selectedIds.length} message(s) will be moved.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, move",
    });
    if (!confirm.isConfirmed) return;
    try {
      await Promise.all(selectedIds.map((id) => api.softDeleteMessage(id)));
      setMessages((prev) =>
        prev.map((m) =>
          selectedIds.includes(m._id) ? { ...m, deleted: true } : m
        )
      );
      setSelectedIds([]);
      setMultiSelectMode(false);
      Swal.fire("Moved!", "Selected messages moved to trash.", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const restoreSelected = async () => {
    const confirm = await Swal.fire({
      title: "Restore selected?",
      text: `${selectedIds.length} message(s) will be restored.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, restore",
    });
    if (!confirm.isConfirmed) return;
    try {
      await Promise.all(selectedIds.map((id) => api.restoreMessage(id)));
      setMessages((prev) =>
        prev.map((m) =>
          selectedIds.includes(m._id) ? { ...m, deleted: false } : m
        )
      );
      setSelectedIds([]);
      setMultiSelectMode(false);
      Swal.fire("Restored!", "Selected messages restored.", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSelectedPermanently = async () => {
    const confirm = await Swal.fire({
      title: "Delete selected permanently?",
      text: `${selectedIds.length} message(s) will be deleted forever!`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;
    try {
      await Promise.all(selectedIds.map((id) => api.deleteMessage(id)));
      setMessages((prev) => prev.filter((m) => !selectedIds.includes(m._id)));
      setSelectedIds([]);
      setMultiSelectMode(false);
      Swal.fire("Deleted!", "Selected messages permanently deleted.", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const visibleMessages = messages.filter((m) =>
    showTrash ? m.deleted : !m.deleted
  );
  const deletedCount = messages.filter((m) => m.deleted).length;

  return (
    <div className="flex h-[85vh] max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-gray-100 flex justify-around items-center">
          <div
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => {
              setShowTrash(true);
              setMultiSelectMode(false);
            }}
          >
            <FolderMinus className="w-6 h-6 text-red-600 hover:text-red-700" />
            {deletedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {deletedCount}
              </span>
            )}
            <span className="text-xs text-gray-700 mt-1">Trash</span>
          </div>

          <div
            className="relative flex flex-col items-center cursor-pointer"
            onClick={deleteSingle}
          >
            <Trash2 className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            <span className="text-xs text-gray-700 mt-1">Delete</span>
          </div>

          <div className="relative flex flex-col items-center">
            <button onClick={() => setShowMenu((prev) => !prev)}>
              <MoreVertical className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            </button>
            {showMenu && (
              <div className="absolute top-7 right-0 bg-white border shadow-lg rounded-md z-50 flex flex-col w-52">
                <button
                  className="px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setMultiSelectMode((prev) => !prev);
                    setShowMenu(false);
                  }}
                >
                  {multiSelectMode ? "Cancel Multi-select" : "Multi-select"}
                </button>

                {!showTrash && multiSelectMode && (
                  <button
                    className={`px-4 py-2 text-left hover:bg-gray-100 ${
                      selectedIds.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={deleteSelected}
                  >
                    Delete Selected
                  </button>
                )}

                {showTrash && multiSelectMode && (
                  <>
                    <button
                      className={`px-4 py-2 text-left hover:bg-gray-100 ${
                        selectedIds.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={restoreSelected}
                    >
                      Restore Selected
                    </button>

                    <button
                      className={`px-4 py-2 text-left text-red-600 hover:bg-red-100 ${
                        selectedIds.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={deleteSelectedPermanently}
                    >
                      Delete Selected Permanently
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {showTrash && (
          <div
            className="p-2 border-b bg-gray-50 flex items-center cursor-pointer hover:bg-gray-100"
            onClick={() => setShowTrash(false)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm text-gray-700">Back to Inbox</span>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center mt-10">Loading messages...</p>
        ) : visibleMessages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            {showTrash ? "Trash is empty." : "No messages received yet."}
          </p>
        ) : (
          <ul className="overflow-y-auto flex-1">
            {visibleMessages.map((msg) => (
              <li
                key={msg._id}
                className={`p-4 border-b flex justify-between items-center cursor-pointer hover:bg-gray-100 transition ${
                  selectedMessage?._id === msg._id
                    ? "bg-gray-200 shadow-inner"
                    : msg.read
                    ? "bg-gray-50"
                    : "bg-green-50"
                }`}
              >
                <div className="flex-1" onClick={() => openMessage(msg)}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-medium ${
                          msg.read
                            ? "text-gray-700"
                            : "text-green-700 font-semibold"
                        }`}
                      >
                        {msg.name}
                      </p>

                      {/* ✅ Badges */}
                      {!msg.read && (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-green-200 text-green-800">
                            New
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-200 text-red-800">
                            Unread
                          </span>
                        </>
                      )}
                      {msg.read && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-gray-200 text-gray-700">
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      msg.read ? "text-gray-600" : "text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  {multiSelectMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(msg._id)}
                      onChange={() => toggleSelect(msg._id)}
                      className="mt-1"
                    />
                  )}
                </div>

                {showTrash && (
                  <div className="flex gap-2 ml-2">
                    <button onClick={() => restoreSingle(msg._id)}>
                      <RotateCw className="w-5 h-5 text-green-600 hover:text-green-800" />
                    </button>
                    <button onClick={() => permanentDelete(msg._id)}>
                      <XCircle className="w-5 h-5 text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right panel */}
      <div className="flex-1 p-8 bg-white overflow-y-auto relative">
        {selectedMessage && !showTrash ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex items-center px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              <button
                onClick={() => markAsUnread(selectedMessage._id)}
                className="flex items-center gap-1 text-sm px-3 py-1 bg-yellow-100 rounded-lg text-yellow-800 hover:bg-yellow-200"
              >
                <MailX className="w-4 h-4" />
                Mark Unread
              </button>
            </div>

            <div className="flex justify-between items-start mb-4 border-b pb-3">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {selectedMessage.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedMessage.email}</p>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border">
              {selectedMessage.message}
            </div>
          </>
        ) : (
          <div className="text-gray-400 text-center mt-40 text-lg">
            {showTrash
              ? "Recently Deleted Messages"
              : "Select a message from the left panel to read it"}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactDashboard;
