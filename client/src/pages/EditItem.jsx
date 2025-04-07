import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, updateItem } from "../services/itemService";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    location: "",
    preferredExchange: ""
  });

  // Categories for the dropdown
  const categories = [
    "Furniture",
    "Electronics",
    "Clothing",
    "Books",
    "Toys",
    "Kitchen",
    "Sports",
    "Art",
    "Plants",
    "Other"
  ];

  // Conditions for the dropdown
  const conditions = [
    "New",
    "Like New",
    "Good",
    "Fair",
    "Poor"
  ];

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const item = await getItemById(id, token);
        setFormData({
          title: item.title || "",
          description: item.description || "",
          category: item.category || "",
          location: item.location || ""
        });
      } catch (error) {
        console.error("Error fetching item:", error);
        setError("Failed to load item details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      await updateItem(id, formData, token);
      navigate("/my-barter");
    } catch (error) {
      console.error("Error updating item:", error);
      setError("Failed to update item. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4f1]">
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-[#e2e1d9] py-16 mb-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-[#5c6154] mb-4">
              Edit <span className="italic">Item</span>
            </h1>
            <p className="text-lg text-[#5c6154] mb-4 font-light max-w-2xl">
              Update the details of your item to make it more appealing for bartering.
              Provide clear and accurate information to attract potential trades.
            </p>
            <div className="w-24 h-px bg-[#5c6154] mt-6"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Edit Form Section */}
      <div className="max-w-3xl mx-auto px-6 mb-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c6154]"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white border border-[#e2e1d9] p-8"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-300 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-[#5c6154] mb-2 font-light">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                  placeholder="Item title"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-[#5c6154] mb-2 font-light">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                  placeholder="Describe your item in detail"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="category" className="block text-[#5c6154] mb-2 font-light">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-[#5c6154] mb-2 font-light">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                  >
                    <option value="">Select condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="location" className="block text-[#5c6154] mb-2 font-light">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                  placeholder="Your location (city, neighborhood)"
                />
              </div>

              <div className="mb-8">
                <label htmlFor="preferredExchange" className="block text-[#5c6154] mb-2 font-light">
                  Preferred Exchange
                </label>
                <textarea
                  id="preferredExchange"
                  name="preferredExchange"
                  value={formData.preferredExchange}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                  placeholder="What would you like to exchange this item for? (optional)"
                ></textarea>
              </div>

              {/* Photo upload section would go here - this is just a placeholder as actual image handling would depend on your backend */}
              <div className="mb-8 p-4 bg-[#e2e1d9] bg-opacity-50">
                <p className="text-[#5c6154] mb-2 font-light">Current Photos</p>
                <p className="text-sm text-gray-500">To update photos, please contact support</p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate("/my-barter")}
                  className="px-6 py-3 border border-[#5c6154] text-[#5c6154] hover:bg-[#5c6154] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-3 bg-[#5c6154] text-white hover:bg-[#4a4e42] transition-colors disabled:opacity-70"
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-[#e2e1d9] py-10 mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-[#5c6154] mb-2">Tips for Successful Bartering</h2>
            <div className="w-24 h-px bg-[#5c6154] mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-medium text-[#5c6154] mb-2">Quality Photos</h3>
              <p className="text-gray-600 text-sm">Take clear, well-lit photos that accurately show the condition of your item.</p>
              <div className="w-12 h-px bg-[#5c6154] mt-4"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-medium text-[#5c6154] mb-2">Detailed Description</h3>
              <p className="text-gray-600 text-sm">Include dimensions, age, brand, and any imperfections to set clear expectations.</p>
              <div className="w-12 h-px bg-[#5c6154] mt-4"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-medium text-[#5c6154] mb-2">Be Specific</h3>
              <p className="text-gray-600 text-sm">Clearly state what you're looking to receive in exchange to attract the right barter partners.</p>
              <div className="w-12 h-px bg-[#5c6154] mt-4"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItem;