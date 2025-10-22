import axios from "axios";

const admissionAPI = {
  submitAdmission: (data) => axios.post("http://localhost:5000/api/admission", data),
  getAdmissions: () => axios.get("http://localhost:5000/api/admission"),
};

export default admissionAPI;

