// import axios from "axios";

// const API_URL = "http://localhost:4000/api/items"; // Adjust if needed


// // Fetch items based on user's location
// export const getItems = async (token) => {
//   try {
//     const response = await axios.get(API_URL, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching items:", error);
//     throw error;
//   }
// };

// // Add a new item
// export const addItem = async (itemData, token) => {
//   try {
//     const response = await axios.post(API_URL, itemData, {
//       headers: {
//         Authorization: `Bearer ${token}`,  // ✅ Ensure Bearer token format
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error adding item:", error);
//     throw error;
//   }
// };
// export const getUserItems = async (token) => {
//   try {
//     const response = await axios.get(`${API_URL}/user`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Failed to fetch user items" };
//   }
// };
// // Get a single item by ID
// export const getItemById = async (id, token) => {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching item:", error);
//     throw error;
//   }
// };

// // Update an item
// export const updateItem = async (id, itemData, token) => {
//   try {
//     const response = await axios.put(`${API_URL}/${id}`, itemData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating item:", error);
//     throw error;
//   }
// };

// // Delete an item
// export const deleteItem = async (id, token) => {
//   try {
//     const response = await axios.delete(`${API_URL}/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting item:", error);
//     throw error;
//   }
// };
// // Send a barter request
// export const sendBarterRequest = async (itemId, token) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:4000/api/barter-requests",
//       { itemId },  // Send only the itemId
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error sending barter request:", error);
//     throw error;
//   }
// };

// // Fetch barter requests received by the logged-in user
// export const getReceivedBarterRequests = async (token) => {
//   try {
//     const response = await axios.get("http://localhost:4000/api/barter-items/barter-requests", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching barter requests:", error);
//     throw error;
//   }
// };

// // Accept or Decline a barter request
// export const updateBarterRequestStatus = async (requestId, status, token) => {
//   try {
//     const response = await axios.patch(
//       `http://localhost:4000/api/barter-requests/${requestId}`,
//       { status },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating barter request to ${status}:`, error);
//     throw error;
//   }
// };


import axios from "axios";

const API_URL = "http://localhost:4000/api";

// Fetch items based on user's location
export const getItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/items`, {
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
    const response = await axios.post(`${API_URL}/items`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};

// Get user's items
export const getUserItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/items/user`, {
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
    const response = await axios.get(`${API_URL}/items/${id}`, {
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
    const response = await axios.put(`${API_URL}/items/${id}`, itemData, {
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
    const response = await axios.delete(`${API_URL}/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// Send a barter request - FIXED VERSION
export const sendBarterRequest = async (itemId, ownerId, message = "I would like to barter for this item.", offerDetails = "I can offer another item in exchange.") => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    
    const requestBody = {
      itemId,
      ownerId,
      message,
      offerDetails
    };
    
    const response = await axios.post(
      `${API_URL}/requests`,
      requestBody,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error sending barter request:", error);
    throw error.response?.data || error;
  }
};

// Fetch barter requests received by the logged-in user
export const getReceivedBarterRequests = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/barter-items/barter-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching barter requests:", error);
    throw error;
  }
};

// Accept or Decline a barter request
export const updateBarterRequestStatus = async (requestId, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/requests/${requestId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating barter request to ${status}:`, error);
    throw error;
  }
};

export const getSentBarterRequests = async (token) => {
  const res = await axios.get("http://localhost:4000/api/requests/sent", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
