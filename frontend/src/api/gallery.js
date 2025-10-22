import axios from "axios";

const API_URL = "https://jr-school-67nt.onrender.com/api/gallery"; // adjust if your server uses another port

const api = {
  getAll: () => axios.get(API_URL),
  getDeleted: () => axios.get(`${API_URL}/deleted`),
  add: (formData) =>
    axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  softDelete: (id) => axios.patch(`${API_URL}/delete/${id}`),
  restore: (id) => axios.patch(`${API_URL}/restore/${id}`),
  permanentDelete: (id) => axios.delete(`${API_URL}/${id}`),
};

export default api;
