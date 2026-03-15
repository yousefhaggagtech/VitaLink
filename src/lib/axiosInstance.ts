import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://vitalink20251014200825.azurewebsites.net",
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

