import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; 

// Signup Request
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login Request
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout (Remove Token from Local Storage)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get Authenticated User
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
