import axios from "axios";

const API_URL = "http://localhost:5000/api/items"; // Adjust if needed

// Fetch items based on user's location
export const getItems = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Add a new item
export const addItem = async (itemData, token) => {
  try {
    const response = await axios.post(API_URL, itemData, {
      headers: { Authorization: `Bearer ${token}` },"Content-Type": "multipart/form-data",
    });
    return response.data;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};
export const getUserItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/items/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user items" };
  }
};
// Get a single item by ID
export const getItemById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
};

// Update an item
export const updateItem = async (id, itemData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, itemData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};
