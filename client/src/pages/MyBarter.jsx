// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getUserItems, deleteItem } from "../services/itemService";
// import Navbar from "../components/Navbar";

// const MyBarter = () => {
//   const [items, setItems] = useState([]);
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const userItems = await getUserItems(token);
//         setItems(userItems);
//       } catch (error) {
//         console.error("Error fetching user items:", error);
//       }
//     };
//     fetchItems();
//   }, [token]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       try {
//         await deleteItem(id, token);
//         setItems(items.filter((item) => item._id !== id));
//         alert("Item deleted successfully.");
//       } catch (error) {
//         console.error("Error deleting item:", error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="max-w-7xl mx-auto p-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">My Barter Items</h1>

//         {items.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {items.map((item) => (
//               <div key={item._id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
//                 <p className="text-gray-600 mb-4">{item.description}</p>
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{item.category}</span>
//                   <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{item.location}</span>
//                 </div>

//                 <div className="flex space-x-4 mt-4">
//                   <button 
//                     className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md"
//                     onClick={() => handleDelete(item._id)}
//                   >
//                     Delete
//                   </button>
//                   <button 
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
//                     onClick={() => navigate(`/edit-item/${item._id}`)}
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-xl shadow">
//             <div className="text-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//               <p className="mt-4 text-lg text-gray-600">You haven't posted any items yet.</p>
//               <button
//                 onClick={() => navigate("/post-item")}
//                 className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
//               >
//                 Post an Item
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyBarter;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserItems, deleteItem, getReceivedBarterRequests, updateBarterRequestStatus } from "../services/itemService";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const MyBarter = () => {
  const [items, setItems] = useState([]);
  const [barterRequests, setBarterRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const userItems = await getUserItems(token);
        setItems(userItems);
      } catch (error) {
        console.error("Error fetching user items:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBarterRequests = async () => {
      try {
        const requests = await getReceivedBarterRequests(token);
        setBarterRequests(requests);
      } catch (error) {
        console.error("Error fetching barter requests:", error);
      }
    };

    fetchItems();
    fetchBarterRequests();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(id, token);
        setItems(items.filter((item) => item._id !== id));
        alert("Item deleted successfully.");
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await updateBarterRequestStatus(requestId, status, token);
      setBarterRequests(barterRequests.filter((request) => request._id !== requestId));
      alert(`Request ${status}!`);
    } catch (error) {
      console.error("Error updating barter request:", error);
    }
  };

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

      {/* Hero Section */}
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
                My <span className="italic">Barter</span> Items
              </motion.h1>
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-[#5c6154] mb-8 font-light"
              >
                Manage your listings and barter requests. View, edit, or remove items you've listed for bartering.
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
                  Post New Item
                </button>
                <button 
                  className="border border-[#5c6154] text-[#5c6154] px-6 py-3 rounded-sm hover:bg-[#5c6154] hover:text-white transition-colors"
                  onClick={() => navigate("/")}
                >
                  Browse Marketplace
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
                {items.length > 0 ? (
                  <img 
                    src={getFirstImage(items[0].image)} 
                    alt="Your Item" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#d1d0c5] flex items-center justify-center">
                    <p className="text-[#5c6154]">You haven't posted any items yet</p>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-[#5c6154] bg-opacity-80 p-4 text-white">
                  <p className="font-light italic text-sm">Your Barter Items</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* My Items Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-[#5c6154] mb-2">Your Listed Items</h2>
          <div className="w-24 h-px bg-[#5c6154] mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c6154]"></div>
          </div>
        ) : items.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {items.map((item, index) => (
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
                    <span className="text-xs bg-white bg-opacity-80 text-[#5c6154] px-2 py-1">ID: {item._id?.slice(-4)}</span>
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
                      onClick={() => navigate(`/edit-item/${item._id}`)}
                    >
                      Edit Details
                    </button>
                    <button 
                      className="bg-[#5c6154] text-white px-4 py-2 hover:bg-[#4a4e42] transition-colors text-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex justify-center items-center p-12 bg-white border border-[#e2e1d9]"
          >
            <div className="text-center">
              <p className="text-lg text-[#5c6154] mb-4">You haven't posted any items yet.</p>
              <button 
                onClick={() => navigate("/post-item")}
                className="bg-[#5c6154] text-white px-6 py-3 rounded-sm hover:bg-[#4a4e42] transition-colors"
              >
                Post an Item
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Barter Requests Section */}
      <div className="bg-[#e2e1d9] py-10 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-[#5c6154] mb-2">Barter Requests</h2>
            <div className="w-24 h-px bg-[#5c6154] mx-auto mb-6"></div>
            <p className="text-lg text-[#5c6154] mb-8 font-light max-w-2xl mx-auto">
              Manage requests from others who want to barter for your items. Accept or decline based on your preferences.
            </p>
          </div>
          
          {barterRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {barterRequests.map((request, index) => (
                <motion.div 
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="bg-white p-6 shadow-sm"
                >
                  <p className="text-gray-500 text-sm mb-2">Request ID: {request._id?.slice(-4)}</p>
                  <p className="text-[#5c6154] mb-1 text-lg font-light">
                    <span className="italic">{request.itemId?.title}</span>
                  </p>
                  <p className="text-gray-500 text-sm mb-4">Status: {request.status}</p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="bg-[#5c6154] text-white px-4 py-2 rounded-sm hover:bg-[#4a4e42] transition-colors"
                      onClick={() => handleRequestAction(request._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="border border-[#5c6154] text-[#5c6154] px-4 py-2 rounded-sm hover:bg-[#5c6154] hover:text-white transition-colors"
                      onClick={() => handleRequestAction(request._id, "declined")}
                    >
                      Decline
                    </button>
                  </div>
                  <div className="w-12 h-px bg-[#5c6154] mt-6"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center p-12 bg-white"
            >
              <div className="text-center">
                <p className="text-lg text-[#5c6154]">No barter requests received.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Newsletter/Tips Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-white border border-[#e2e1d9] p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-light text-[#5c6154] mb-3">Barter Tips</h3>
            <p className="text-gray-600 mb-6">Sign up to receive tips on successful bartering and notifications about new items in your community</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow p-3 border border-[#d1d0c5] focus:border-[#5c6154] focus:ring-0"
              />
              <button className="bg-[#5c6154] text-white px-6 py-3 hover:bg-[#4a4e42] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBarter;