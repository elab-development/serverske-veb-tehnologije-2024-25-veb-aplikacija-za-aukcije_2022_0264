import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// automatski dodaj Bearer token na svaki request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
