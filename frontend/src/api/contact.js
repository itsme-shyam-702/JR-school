import axios from "axios";

const API_URL = "https://jr-school-67nt.onrender.com/api/contact";

const api = {
  sendMessage: (data) => axios.post(API_URL, data),
  getMessages: () => axios.get(API_URL),
  updateRead: (id) => axios.put(`${API_URL}/read/${id}`),
  softDeleteMessage: (id) => axios.put(`${API_URL}/soft-delete/${id}`),
  restoreMessage: (id) => axios.put(`${API_URL}/restore/${id}`),
  deleteMessage: (id) => axios.delete(`${API_URL}/delete/${id}`), // keep this name
};

export default api;
