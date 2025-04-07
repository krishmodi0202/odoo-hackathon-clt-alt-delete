// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import axios from "axios";

// const PostItem = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     barterOption: "",
//     location: "",
//   });

//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length < 3) {
//       alert("Please select at least 3 images.");
//       return;
//     }
//     setImages(selectedFiles);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("You must be logged in to post an item.");
//       navigate("/login");
//       setLoading(false);
//       return;
//     }

//     try {
//       const formDataObj = new FormData();

//       // Append regular form fields
//       Object.keys(formData).forEach((key) => {
//         formDataObj.append(key, formData[key]);
//       });

//       // Append image files
//       images.forEach((image) => {
//         formDataObj.append("image", image); // must match backend field name
//       });

//       await axios.post("http://localhost:4000/api/items", formDataObj, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Item posted successfully!");
//       navigate("/dashboard");

//     } catch (error) {
//       console.error("Error posting item:", error.response?.data || error);
//       setError(error.response?.data?.error || "Failed to post item.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a New Item</h1>

//         {error && <p className="text-red-600 mb-4">{error}</p>}

//         <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
//             ></textarea>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Category</label>
//               <input
//                 type="text"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Desired Exchange Item</label>
//               <input
//                 type="text"
//                 name="barterOption"
//                 value={formData.barterOption}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
//               />
//             </div>
//           </div>

//           <div className="mt-4">
//             <label className="block text-gray-700 font-semibold mb-2">Location</label>
//             <input
//               type="text"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
//             />
//           </div>

//           <div className="mt-4">
//             <label className="block text-gray-700 font-semibold mb-2">Upload Images (Min 3)</label>
//             <input
//               type="file"
//               name="images"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md w-full flex items-center justify-center"
//           >
//             {loading ? "Posting..." : "Post Item"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PostItem;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { motion } from "framer-motion";

const PostItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    barterOption: "",
    location: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const navigate = useNavigate();

  // Predefined categories
  const categories = ["Furniture", "Electronics", "Clothing", "Books", "Home Decor", "Plants", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "Other") {
      setIsOtherCategory(true);
      setFormData({ ...formData, category: "" });
    } else {
      setIsOtherCategory(false);
      setFormData({ ...formData, category: selectedCategory });
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length < 3) {
      alert("Please select at least 3 images.");
      return;
    }
    setImages(selectedFiles);
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

      // Append regular form fields
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      // Append image files
      images.forEach((image) => {
        formDataObj.append("image", image); // must match backend field name
      });

      await axios.post("http://localhost:4000/api/items", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Item posted successfully!");
      navigate("/dashboard");

    } catch (error) {
      console.error("Error posting item:", error.response?.data || error);
      setError(error.response?.data?.error || "Failed to post item.");
    } finally {
      setLoading(false);
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
        className="bg-[#e2e1d9] py-12 mb-12"
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl font-light text-[#5c6154] mb-4"
          >
            List Your <span className="italic">Item</span>
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg text-[#5c6154] font-light"
          >
            Share what you're willing to barter with our community
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm shadow-sm border border-[#e2e1d9]">
            <div className="mb-6">
              <label className="block text-[#5c6154] font-light mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                placeholder="What are you offering for barter?"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#5c6154] font-light mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                placeholder="Describe your item in detail"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[#5c6154] font-light mb-2">Category</label>
                <select
                  name="categorySelect"
                  onChange={handleCategoryChange}
                  required
                  className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0 bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                {isOtherCategory && (
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter custom category"
                    required
                    className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0 mt-2"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-[#5c6154] font-light mb-2">Desired Exchange Item</label>
                <input
                  type="text"
                  name="barterOption"
                  value={formData.barterOption}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                  placeholder="What would you like in return?"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[#5c6154] font-light mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
                placeholder="Your city or neighborhood"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[#5c6154] font-light mb-2">Upload Images (Min 3)</label>
              <div className="border border-dashed border-[#d1d0c5] p-8 text-center">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required
                  className="w-full"
                />
                <p className="text-gray-500 text-sm mt-2">Please upload at least 3 images of your item</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="border border-[#5c6154] text-[#5c6154] px-6 py-3 rounded-sm hover:bg-[#5c6154] hover:text-white transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-[#5c6154] text-white px-8 py-3 rounded-sm hover:bg-[#4a4e42] transition-colors shadow-sm"
              >
                {loading ? "Posting..." : "Post Item"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      
      {/* Footer section with matching dashboard style */}
      <div className="bg-[#e2e1d9] py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#5c6154] text-sm">
            Share your items mindfully with others in your community
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostItem;