export const getBarterItems = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/barter-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched barter items:", data);
      return data;
    } catch (error) {
      console.error("Error fetching barter items:", error);
      return [];
    }
  };
  