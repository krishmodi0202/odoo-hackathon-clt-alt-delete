import axios from "axios";

export const sendBarterRequest = async (itemId, ownerId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");
  console.log(ownerId)

  const requestBody = {
    itemId,
    ownerId,
    message: "I would like to barter for this item.",
    offerDetails: "I can offer another item in exchange.", // Optional
  };

  const response = await axios.post(
    "http://localhost:4000/api/requests",
    requestBody,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
