import { useEffect, useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react"; // icons
import api from "../api/admission";

function AdmissionDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // track open menu

  // Fetch admissions on mount
  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const res = await api.getAdmissions();
        setAdmissions(res.data);
      } catch (err) {
        console.error("Error fetching admissions:", err);
      }
    }
    fetchAdmissions();
  }, []);

  // Delete admission
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admission?")) return;

    try {
      await api.deleteAdmission(id);
      setAdmissions((prev) => prev.filter((adm) => adm._id !== id));
      setMenuOpen(null);
    } catch (err) {
      console.error("Error deleting admission:", err);
      alert("Failed to delete admission. Check console for details.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded relative">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Admission Dashboard</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Class</th>
            <th className="border px-4 py-2">DOB</th>
            <th className="border px-4 py-2">Parent Name</th>
            <th className="border px-4 py-2">Contact</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Submitted On</th>
            <th className="border px-4 py-2 w-12">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admissions.map((adm) => (
            <tr key={adm._id} className="text-center relative hover:bg-gray-50">
              <td className="border px-4 py-2">{adm.name}</td>
              <td className="border px-4 py-2">{adm.selectedClass}</td>
              <td className="border px-4 py-2">{new Date(adm.dob).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{adm.parentName}</td>
              <td className="border px-4 py-2">{adm.contact}</td>
              <td className="border px-4 py-2">{adm.address}</td>
              <td className="border px-4 py-2">{new Date(adm.createdAt).toLocaleString()}</td>
              <td className="border px-4 py-2 relative">
                {/* Three-dot menu */}
                <button
                  onClick={() => setMenuOpen(menuOpen === adm._id ? null : adm._id)}
                  className="p-1 rounded hover:bg-gray-200 transition"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown menu */}
                {menuOpen === adm._id && (
                  <div className="absolute right-6 top-10 bg-white border shadow-md rounded w-32 z-10">
                    <button
                      onClick={() => handleDelete(adm._id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdmissionDashboard;
