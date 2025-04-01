import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const PostItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    barterOption: "",
    location: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post an item.");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      await axios.post("http://localhost:4000/api/items", formDataObj, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("Item posted successfully!");
      navigate("/dashboard");
      // console.log("Item posted:", response.data);
      
    } catch (error) {
      console.error("Error posting item:", error.response?.data || error);
      setError(error.response?.data?.error || "Failed to post item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a New Item</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Desired Exchange Item</label>
              <input type="text" name="barterOption" value={formData.barterOption} onChange={handleChange} required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200" />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} required 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200" />
          </div>

          <button type="submit" disabled={loading} 
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md w-full flex items-center justify-center">
            {loading ? "Posting..." : "Post Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
