import { useEffect, useState } from "react";
import api from "../api/admission";

function AdmissionDashboard() {
  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    async function fetchAdmissions() {
      const res = await api.getAdmissions();
      setAdmissions(res.data);
    }
    fetchAdmissions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded">
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
          </tr>
        </thead>
        <tbody>
          {admissions.map((adm, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{adm.name}</td>
              <td className="border px-4 py-2">{adm.selectedClass}</td>
              <td className="border px-4 py-2">{new Date(adm.dob).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{adm.parentName}</td>
              <td className="border px-4 py-2">{adm.contact}</td>
              <td className="border px-4 py-2">{adm.address}</td>
              <td className="border px-4 py-2">{new Date(adm.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdmissionDashboard;
