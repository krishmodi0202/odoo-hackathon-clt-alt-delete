import axios from "axios";

const API_URL = "http://localhost:5000/api/barter-requests"; // Update if needed

export const getBarterRequests = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching barter requests:", error);
    return [];
  }
};
