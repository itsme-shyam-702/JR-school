import axios from "axios";

// Use your deployed backend URL here
const API_URL = "https://jr-school-67nt.onrender.com/api/admission";

const admissionAPI = {
  submitAdmission: (data) => axios.post(API_URL, data),
  getAdmissions: () => axios.get(API_URL),
  deleteAdmission: (id) => axios.delete(`${API_URL}/${id}`),
};

export default admissionAPI;
