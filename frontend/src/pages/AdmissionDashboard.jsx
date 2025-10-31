// import { useEffect, useState } from "react";
// import { MoreVertical, Trash2 } from "lucide-react";
// import Swal from "sweetalert2";
// import api from "../api/admission";

// // ✅ SweetAlert Toast Instance (same as Gallery)
// const Toast = Swal.mixin({
//   toast: true,
//   position: "bottom-end",
//   showConfirmButton: false,
//   timer: 2500,
//   timerProgressBar: true,
//   background: "#fff",
//   color: "#333",
//   didOpen: (toast) => {
//     toast.onmouseenter = Swal.stopTimer;
//     toast.onmouseleave = Swal.resumeTimer;
//   },
// });

// function AdmissionDashboard() {
//   const [admissions, setAdmissions] = useState([]);
//   const [menuOpen, setMenuOpen] = useState(null);

//   // 🟢 Fetch admissions on mount
//   useEffect(() => {
//     async function fetchAdmissions() {
//       try {
//         const res = await api.getAdmissions();
//         setAdmissions(res.data);
//       } catch (err) {
//         console.error("Error fetching admissions:", err);
//         Swal.fire("Error!", "Failed to load admissions.", "error");
//       }
//     }
//     fetchAdmissions();
//   }, []);

//   // 🗑 Delete admission (with SweetAlert)
//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This admission record will be permanently deleted.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await api.deleteAdmission(id);
//           setAdmissions((prev) => prev.filter((adm) => adm._id !== id));
//           setMenuOpen(null);
//           Toast.fire({
//             icon: "success",
//             title: "Admission deleted successfully!",
//           });
//         } catch (err) {
//           console.error("Error deleting admission:", err);
//           Swal.fire("Error!", "Failed to delete admission.", "error");
//         }
//       }
//     });
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded relative">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4">
//         Admission Dashboard
//       </h2>

//       {admissions.length === 0 ? (
//         <p className="text-center text-gray-500 py-10">
//           No admission records found.
//         </p>
//       ) : (
//         <table className="w-full border border-gray-300">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-4 py-2">Name</th>
//               <th className="border px-4 py-2">Class</th>
//               <th className="border px-4 py-2">DOB</th>
//               <th className="border px-4 py-2">Parent Name</th>
//               <th className="border px-4 py-2">Contact</th>
//               <th className="border px-4 py-2">Address</th>
//               <th className="border px-4 py-2">Submitted On</th>
//               <th className="border px-4 py-2 w-12">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {admissions.map((adm) => (
//               <tr
//                 key={adm._id}
//                 className="text-center relative hover:bg-gray-50 transition"
//               >
//                 <td className="border px-4 py-2">{adm.name}</td>
//                 <td className="border px-4 py-2">{adm.selectedClass}</td>
//                 <td className="border px-4 py-2">
//                   {new Date(adm.dob).toLocaleDateString()}
//                 </td>
//                 <td className="border px-4 py-2">{adm.parentName}</td>
//                 <td className="border px-4 py-2">{adm.contact}</td>
//                 <td className="border px-4 py-2">{adm.address}</td>
//                 <td className="border px-4 py-2">
//                   {new Date(adm.createdAt).toLocaleString()}
//                 </td>
//                 <td className="border px-4 py-2 relative">
//                   {/* Three-dot menu */}
//                   <button
//                     onClick={() =>
//                       setMenuOpen(menuOpen === adm._id ? null : adm._id)
//                     }
//                     className="p-1 rounded hover:bg-gray-200 transition"
//                   >
//                     <MoreVertical size={18} />
//                   </button>

//                   {/* Dropdown menu */}
//                   {menuOpen === adm._id && (
//                     <div className="absolute right-6 top-10 bg-white border shadow-md rounded w-32 z-10">
//                       <button
//                         onClick={() => handleDelete(adm._id)}
//                         className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
//                       >
//                         <Trash2 size={14} /> Delete
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default AdmissionDashboard;

import { useEffect, useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useUser } from "@clerk/clerk-react"; // 👈 Clerk user import
import api from "../api/admission";

// ✅ SweetAlert Toast
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

function AdmissionDashboard() {
  const { user, isLoaded } = useUser(); // Clerk user
  const [admissions, setAdmissions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  // 🟢 Identify role
  const userRole = user?.publicMetadata?.role; // 'admin' | 'staff'
  const isAdmin = userRole === "admin";
  const isStaff = userRole === "staff";

  // 🟢 Fetch admissions
  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await api.getAdmissions();
        setAdmissions(res.data);
      } catch (err) {
        console.error("Error fetching admissions:", err);
        Swal.fire("Error!", "Failed to load admissions.", "error");
      }
    };
    fetchAdmissions();
  }, []);

  // 🗑 Delete admission (admin only)
  const handleDelete = async (id) => {
    if (!isAdmin) {
      Swal.fire("Permission Denied", "Only admin can delete records.", "warning");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "This admission record will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteAdmission(id);
          setAdmissions((prev) => prev.filter((adm) => adm._id !== id));
          setMenuOpen(null);
          Toast.fire({
            icon: "success",
            title: "Admission deleted successfully!",
          });
        } catch (err) {
          console.error("Error deleting admission:", err);
          Swal.fire("Error!", "Failed to delete admission.", "error");
        }
      }
    });
  };

  // 🕒 Loading / Role restriction
  if (!isLoaded) {
    return <p className="text-center text-gray-500 py-10">Loading...</p>;
  }

  if (!isAdmin && !isStaff) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Access Restricted</h2>
        <p className="text-gray-600">You don’t have permission to view admission logs.</p>
      </div>
    );
  }

  // 🧩 Page UI
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded relative">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Admission Dashboard</h2>

      {admissions.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No admission records found.</p>
      ) : (
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
              {isAdmin && <th className="border px-4 py-2 w-12">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {admissions.map((adm) => (
              <tr key={adm._id} className="text-center relative hover:bg-gray-50 transition">
                <td className="border px-4 py-2">{adm.name}</td>
                <td className="border px-4 py-2">{adm.selectedClass}</td>
                <td className="border px-4 py-2">{new Date(adm.dob).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{adm.parentName}</td>
                <td className="border px-4 py-2">{adm.contact}</td>
                <td className="border px-4 py-2">{adm.address}</td>
                <td className="border px-4 py-2">{new Date(adm.createdAt).toLocaleString()}</td>

                {/* 👑 Only Admin can delete */}
                {isAdmin && (
                  <td className="border px-4 py-2 relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === adm._id ? null : adm._id)}
                      className="p-1 rounded hover:bg-gray-200 transition"
                    >
                      <MoreVertical size={18} />
                    </button>

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
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdmissionDashboard;
