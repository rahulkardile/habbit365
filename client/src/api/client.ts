import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.API_ENDPOINT || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach token automatically
// apiClient.interceptors.request.use(async (config) => {
//   const token = "YOUR_AUTH_TOKEN"; // fetch from storage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;