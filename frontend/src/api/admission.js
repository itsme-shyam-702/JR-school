import axios from "axios";

// 🔐 Base API URL
const API_URL = "https://jr-school-67nt.onrender.com/api/admission";

// ✅ Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// ✅ Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ Auto logout if token is invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("JWT expired or unauthorized. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const admissionAPI = {
  // 📩 Submit admission (visitor/staff/admin)
  submitAdmission: (data) => api.post("/", data),

  // 📜 Fetch all admissions (staff/admin only)
  getAdmissions: () => api.get("/"),

  // 🗑️ Delete admission
  deleteAdmission: (id) => api.delete(`/${id}`),
};

export default admissionAPI;
