import { useState, useEffect } from "react";
import { addItem } from "../services/itemService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PostItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    barterOption: "",
    image: null,
  });
  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Categories options
  const categories = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Books",
    "Home Appliances",
    "Sports Equipment",
    "Art & Collectibles",
    "Toys & Games",
    "Vehicles",
    "Other"
  ];

  // Barter options
  const barterOptions = [
    { value: "Trade", label: "Trade for another item" },
    { value: "Exchange", label: "Exchange for service" },
    { value: "Giveaway", label: "Free giveaway" },
    { value: "Loan", label: "Temporary loan" }
  ];

  // Create image preview when an image is selected
  useEffect(() => {
    if (!formData.image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.image);
    setPreview(objectUrl);

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 3) newErrors.title = "Title must be at least 3 characters";
    
    if (!formData.description.trim()) newErrors.description = "Description is required";
    else if (formData.description.length < 10) newErrors.description = "Description must be at least 10 characters";
    
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.barterOption) newErrors.barterOption = "Please select a barter option";
    if (!formData.image) newErrors.image = "Please upload an image";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, value);
        });

        // Add item to backend
        const response = await addItem(formDataObj, token);

        // Redirect to barter dashboard if barterOption is selected
        if (formData.barterOption !== "Giveaway") {
            navigate("/my-barter", { 
                state: { notification: { type: "success", message: "Item added to barter system!" } } 
            });
        } else {
            navigate("/dashboard", { 
                state: { notification: { type: "success", message: "Item posted successfully!" } } 
            });
        }
    } catch (error) {
        console.error("Error adding item", error);
        setErrors({ submit: error.message || "Failed to post item. Please try again." });
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Post a New Item</h2>
              <p className="text-indigo-100 mt-1">
                Share what you'd like to exchange with others
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6" encType="multipart/form-data">
              {/* Error message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.submit}
                </div>
              )}
              
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What are you offering?"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your item, its condition, and what you're looking for in return"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
              
              {/* Two columns for Location and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Neighborhood, etc."
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>
                
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
              </div>
              
              {/* Barter Option */}
              <div>
                <label htmlFor="barterOption" className="block text-sm font-medium text-gray-700 mb-1">
                  Barter Option *
                </label>
                <select
                  id="barterOption"
                  name="barterOption"
                  value={formData.barterOption}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.barterOption ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">What type of exchange are you looking for?</option>
                  {barterOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.barterOption && <p className="mt-1 text-sm text-red-600">{errors.barterOption}</p>}
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image *
                </label>
                <div className="flex items-center justify-center flex-col border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer w-full h-full flex flex-col items-center">
                    {preview ? (
                      <div className="relative w-full">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="mx-auto max-h-64 rounded-lg object-contain mb-2" 
                        />
                        <p className="text-sm text-center text-indigo-600">Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-between items-center pt-4">
                <button 
                  type="button" 
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium 
                    hover:from-indigo-700 hover:to-purple-700 transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Post Item
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;