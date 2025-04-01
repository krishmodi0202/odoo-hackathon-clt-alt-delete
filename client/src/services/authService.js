import axios from "axios";

const API_URL = "http://localhost:4000/api/auth"; 

// Signup Request
// export const signup = async (userData) => {
//   try {
//     console.log(userData)
//     const response = await axios.post(`${API_URL}/signup`, userData);
//     return response;
//   } catch (error) {
//     throw error.response;
//   }
// };

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data; // ✅ Only return actual data, NOT the whole response object
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Signup failed");
  }
};

// Login Request
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console(error)
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
