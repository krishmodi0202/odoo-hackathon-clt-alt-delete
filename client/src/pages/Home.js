import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/items")
      .then(response => setItems(response.data))
      .catch(error => console.error("Error fetching items:", error));
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Neighborhood Exchange</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="border p-4 shadow-lg rounded-lg">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
            <p className="text-sm">{item.description}</p>
            <p className="text-sm text-gray-500">{item.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
