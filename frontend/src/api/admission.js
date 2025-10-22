import axios from "axios";

const admissionAPI = {
  submitAdmission: (data) => axios.post("https://jr-school-67nt.onrender.com/api/admission", data),
  getAdmissions: () => axios.get("https://jr-school-67nt.onrender.com/api/admission"),
};

export default admissionAPI;

