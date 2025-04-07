
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import axios from "axios";
// import { sendBarterRequest } from "../services/reqService"; // Import barter function

// const Dashboard = () => {
//   const [items, setItems] = useState([]);
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/api/items", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(response.data)
//         setItems(response.data);
//       } catch (error) {
//         console.error("Error fetching items", error);
//       }
//     };

//     fetchItems();
//   }, [token]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleBarterRequest = async (itemId, ownerId) => {
//     console.log(ownerId)
//     try {
//       await sendBarterRequest(itemId, ownerId);
//       alert("Barter request sent successfully!");
//     } catch (error) {
//       console.error("Error sending barter request", error);
//       alert("Failed to send barter request.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 mt-10 pt-12">
//             Items Available in Your City
//           </h1>
//           <div className="flex space-x-4">
//             <button
//               onClick={() => navigate("/post-item")}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md flex items-center"
//             >
//               Post Item
//             </button>
//             <button
//               onClick={handleLogout}
//               className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md flex items-center"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {items.length > 0 ? (
//             items.map((item) => (
//               <div 
//                 key={item._id} 
//                 className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//               >
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
//                 <p className="text-gray-600 mb-4">{item.description}</p>
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                     {item.category}
//                   </span>
//                   <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                     {item.location}
//                   </span>
//                 </div>
//                 <div className="flex space-x-2 mt-4">
//                 <button 
//   className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
//   onClick={() => navigate(`/item/${item._id}`)} // Navigate to item details
// >
//   View Details
// </button>

//                   <button 
//                     className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
//                     onClick={() => handleBarterRequest(item._id,item.userId)}
//                   >
//                     Barter
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-xl shadow">
//               <p className="text-lg text-gray-600">No items available in your city.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import axios from "axios";
// import { sendBarterRequest } from "../services/reqService"; // Import barter function
// import { motion } from "framer-motion";

// const Dashboard = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:4000/api/items", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(response.data);
//         setItems(response.data);
//       } catch (error) {
//         console.error("Error fetching items", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, [token]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleBarterRequest = async (itemId, ownerId) => {
//     console.log(ownerId);
//     try {
//       await sendBarterRequest(itemId, ownerId);
//       alert("Barter request sent successfully!");
//     } catch (error) {
//       console.error("Error sending barter request", error);
//       alert("Failed to send barter request.");
//     }
//   };

//   // Filter items based on search term and category
//   const filteredItems = items.filter(item => {
//     const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Extract unique categories for filter
//   const categories = ["All", ...new Set(items.map(item => item.category))];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <Navbar />
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto p-6"
//       >
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//           <motion.h1 
//             initial={{ y: -20 }}
//             animate={{ y: 0 }}
//             transition={{ type: "spring", stiffness: 100 }}
//             className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 mt-10 pt-12"
//           >
//             Items Available in Your City
//           </motion.h1>
//           <div className="flex space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/post-item")}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md flex items-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//               </svg>
//               Post Item
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleLogout}
//               className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md flex items-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 5.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//               Logout
//             </motion.button>
//           </div>
//         </div>

//         <div className="mb-8 bg-white p-4 rounded-xl shadow-md">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search items..."
//                 className="pl-10 p-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <select
//               className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, staggerChildren: 0.1 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           >
//             {filteredItems.length > 0 ? (
//               filteredItems.map((item, index) => (
//                 <motion.div 
//                   key={item._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
//                   className="bg-white border border-gray-200 p-6 rounded-xl shadow-md transition-all duration-300"
//                 >
//                   <div className="flex justify-between items-start mb-3">
//                     <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
//                     <span className="text-xs text-gray-500">ID: {item._id.slice(-4)}</span>
//                   </div>
//                   <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//                       </svg>
//                       {item.category}
//                     </span>
//                     <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                       </svg>
//                       {item.location}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center mt-4">
//                     <motion.button 
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
//                       onClick={() => navigate(`/item/${item._id}`)}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                         <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                         <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                       </svg>
//                       View Details
//                     </motion.button>
//                     <motion.button 
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
//                       onClick={() => handleBarterRequest(item._id, item.userId)}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M8 5a1 1 0 011 1v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 110-2h1V6a1 1 0 011-1z" clipRule="evenodd" />
//                         <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H4a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H4z" />
//                         <path d="M3 10a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zm7-6a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2h-4z" />
//                         <path d="M11 10a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" />
//                       </svg>
//                       Barter
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               ))
//             ) : (
//               <motion.div 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="col-span-full flex justify-center items-center p-8 bg-white rounded-xl shadow"
//               >
//                 <div className="text-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                   </svg>
//                   <p className="text-lg text-gray-600">No items available matching your criteria.</p>
//                   <button 
//                     onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
//                     className="mt-4 text-blue-600 hover:text-blue-800"
//                   >
//                     Clear filters
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { sendBarterRequest } from "../services/reqService";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [recentBarters, setRecentBarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:4000/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setItems(response.data);
        
        // Get 3 random items for featured section
        const shuffled = [...response.data].sort(() => 0.5 - Math.random());
        setFeaturedItems(shuffled.slice(0, 3));
        
        // Simulate recent barters (in production, you would fetch this from your API)
        setRecentBarters([
          { id: 1, user: "Alex", item: "Vintage Chair", date: "2 hours ago" },
          { id: 2, user: "Jamie", item: "Plant Collection", date: "4 hours ago" },
          { id: 3, user: "Taylor", item: "Ceramic Vase", date: "1 day ago" }
        ]);
      } catch (error) {
        console.error("Error fetching items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBarterRequest = async (itemId, ownerId) => {
    console.log(ownerId);
    try {
      await sendBarterRequest(itemId, ownerId);
      alert("Barter request sent successfully!");
    } catch (error) {
      console.error("Error sending barter request", error);
      alert("Failed to send barter request.");
    }
  };

  // Filter items based on search term and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter
  const categories = ["All", ...new Set(items.map(item => item.category))];

  // Function to get first image from image array
  const getFirstImage = (image) => {
    if (image && image.length > 0) {
      return image[0];
    }
    return "/placeholder-image.jpg"; // Default placeholder image path
  };

  return (
    <div className="min-h-screen bg-[#f8f4f1]">
      <Navbar />
      
      {/* Hero Landing Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-[#e2e1d9] py-16 mb-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-5xl font-light text-[#5c6154] mb-4"
              >
                Mindful <span className="italic">Bartering</span>
              </motion.h1>
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-[#5c6154] mb-8 font-light"
              >
                Exchange items mindfully with others in your community. Give new life to your belongings while discovering new treasures.
              </motion.p>
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex gap-4"
              >
                <button 
                  onClick={() => navigate("/post-item")}
                  className="bg-[#5c6154] text-white px-6 py-3 rounded-sm hover:bg-[#4a4e42] transition-colors"
                >
                  List Your Item
                </button>
                <button 
                  className="border border-[#5c6154] text-[#5c6154] px-6 py-3 rounded-sm hover:bg-[#5c6154] hover:text-white transition-colors"
                  onClick={() => document.getElementById("available-items").scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Items
                </button>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:w-1/2 flex justify-center"
            >
              <div className="relative w-full h-[300px] md:h-[400px] rounded-md overflow-hidden">
                {/* {featuredItems.length > 0 ? (
                  <img 
                    src={getFirstImage(featuredItems[0].images)} 
                    alt="Featured Item" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#d1d0c5] flex items-center justify-center">
                    <p className="text-[#5c6154]">Discover items to barter</p>
                  </div>
                )} */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#5c6154] bg-opacity-80 p-4 text-white">
                  <p className="font-light italic text-sm">Featured Items Available</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Featured Items */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-[#5c6154] mb-2">Featured Items</h2>
          <div className="w-24 h-px bg-[#5c6154] mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c6154]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="group"
              >
                <div className="relative h-80 mb-4 overflow-hidden bg-[#e2e1d9]">
                  <img 
                    src={getFirstImage(item.image)} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <div className="bg-[#5c6154] bg-opacity-80 text-white text-center py-2 px-3">
                      <span className="uppercase text-sm tracking-wide">Barter</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-[#5c6154] font-light text-lg mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{item.category}</p>
                <button 
                  onClick={() => navigate(`/item/${item._id}`)}
                  className="text-[#5c6154] hover:underline text-sm"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Barter Activity */}
      <div className="bg-[#e2e1d9] py-10 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-[#5c6154] mb-2">Recent Barters</h2>
            <div className="w-24 h-px bg-[#5c6154] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentBarters.map((barter, index) => (
              <motion.div 
                key={barter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white p-6 shadow-sm"
              >
                <p className="text-gray-500 text-sm mb-2">{barter.date}</p>
                <p className="text-[#5c6154] mb-1">
                  <span className="font-medium">{barter.owner}</span> bartered 
                  <span className="italic"> {barter.title}</span>
                </p>
                <div className="w-12 h-px bg-[#5c6154] mt-3"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Items Section */}
      <motion.div 
        id="available-items"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 mb-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-[#5c6154] mb-2">Browse All Items</h2>
          <div className="w-24 h-px bg-[#5c6154] mx-auto mb-8"></div>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search items..."
                  className="pl-4 p-3 w-full border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0 bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c6154]"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white border border-[#e2e1d9]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={getFirstImage(item.image)} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className="text-xs bg-white bg-opacity-80 text-[#5c6154] px-2 py-1">ID: {item._id.slice(-4)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-light text-[#5c6154] mb-2">{item.title}</h2>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-[#e2e1d9] text-[#5c6154] text-xs px-3 py-1">
                        {item.category}
                      </span>
                      <span className="bg-[#e2e1d9] text-[#5c6154] text-xs px-3 py-1">
                        {item.location}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <button 
                        className="text-sm text-[#5c6154] hover:underline"
                        onClick={() => navigate(`/item/${item._id}`)}
                      >
                        View Details
                      </button>
                      <button 
                        className="bg-[#5c6154] text-white px-4 py-2 hover:bg-[#4a4e42] transition-colors text-sm"
                        onClick={() => handleBarterRequest(item._id, item.userId)}
                      >
                        Barter
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex justify-center items-center p-12 bg-white border border-[#e2e1d9]"
              >
                <div className="text-center">
                  <p className="text-lg text-[#5c6154] mb-4">No items available matching your criteria.</p>
                  <button 
                    onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                    className="text-[#5c6154] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
      
      {/* Newsletter Section */}
      <div className="bg-[#e2e1d9] py-12 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-light text-[#5c6154] mb-3">Join the List</h3>
            <p className="text-gray-600 mb-6">Sign up to receive notifications about new items available for barter in your community</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
              />
              <button className="bg-[#5c6154] text-white px-6 py-3 hover:bg-[#4a4e42] transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;