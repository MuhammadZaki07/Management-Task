import axios from "axios";

const API_URL = "http://localhost:8000/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const res = await api.post("/login", { email, password });
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Login failed" };
  }
};

export const register = async (userData) => {
  try {
    const res = await api.post("/register", userData);
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Registration failed" };
  }
};

export const getUser = async () => {
  try {
    const res = await api.get("/getData");
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Failed to fetch user" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
