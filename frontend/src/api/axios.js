import axios from "axios";

const api = axios.create({
  baseURL: "/api",  // было http://localhost:8000/api
  withCredentials: true,
});

export default api;