import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/admission";

function Admissions() {
  const [formData, setFormData] = useState({
    name: "",
    selectedClass: "",
    dob: "",
    parentName: "",
    contact: "",
    address: "",
  });

  const [status, setStatus] = useState("");

  const subjectsOffered = [
    "Kannada",
    "English",
    "Hindi",
    "Social",
    "Science",
    "Maths",
    "Electrical Engineering",
    "Elements of Mechanical Engineering",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("Submitting...");
      const res = await api.submitAdmission(formData);

      if (res.status === 200) {
        setStatus("Admission submitted successfully!");

        // ✅ SweetAlert2 success popup
        Swal.fire({
          title: "Success!",
          text: "Admission submitted successfully!",
          icon: "success",
          confirmButtonColor: "#2563eb", // blue
        });

        // Reset form
        setFormData({
          name: "",
          selectedClass: "",
          dob: "",
          parentName: "",
          contact: "",
          address: "",
        });
      } else {
        setStatus("Failed to submit. Try again.");
        Swal.fire({
          title: "Error!",
          text: "Failed to submit. Try again.",
          icon: "error",
          confirmButtonColor: "#ef4444", // red
        });
      }
    } catch (err) {
      console.error(err);
      setStatus("Error submitting form. Please try later.");
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Admission Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Student Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Parent / Guardian Name</label>
          <input
            type="text"
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
          <input
            type="tel"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Select Class</label>
          <select
            value={formData.selectedClass}
            onChange={(e) => setFormData({ ...formData, selectedClass: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">-- Select Class --</option>
            {[8, 9, 10].map((cls) => (
              <option key={cls} value={cls}>{`Class ${cls}`}</option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Subjects Offered:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {subjectsOffered.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
      </form>

      <div className="mt-10 bg-gray-100 p-6 rounded shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Offline Admission Process</h3>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>Visit the school office during working hours (9:00 AM to 4:00 PM).</li>
          <li>Collect the admission form from the reception desk.</li>
          <li>Fill out the form carefully with all required details.</li>
          <li>Attach photocopies of necessary documents (birth certificate, transfer certificate, etc.).</li>
          <li>Submit the completed form along with passport-size photographs.</li>
          <li>Pay the admission fee at the school office counter.</li>
          <li>Collect the acknowledgment receipt and admission confirmation slip.</li>
        </ol>
      </div>
    </div>
  );
}

export default Admissions;
