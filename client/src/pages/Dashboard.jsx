
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { getItems } from "../services/itemService";
// import axios from "axios";


// const Dashboard = () => {
//   const [items, setItems] = useState([]);
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:4000/api/items", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
  
//         setItems(response.data);
//       } catch (error) {
//         console.error("Error fetching items", error);
//       }
//     };
  
//     fetchItems();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
//             Items Available in Your City
//           </h1>
//           <div className="flex space-x-4">
//             <button
//               onClick={() => navigate("/post-item")}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md flex items-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//               </svg>
//               Post Item
//             </button>
//             <button
//               onClick={handleLogout}
//               className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md flex items-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 11.586V7z" clipRule="evenodd" />
//               </svg>
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
//                 <button 
//                   className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
//                   onClick={() => navigate(`/item/${item._id}`)}
//                 >
//                   View Details
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-xl shadow">
//               <div className="text-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                 </svg>
//                 <p className="mt-4 text-lg text-gray-600">No items available in your city.</p>
//                 <p className="mt-2 text-sm text-gray-500">Be the first to post something!</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { sendBarterRequest } from "../services/reqService"; // Import barter function

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };

    fetchItems();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBarterRequest = async (itemId, ownerId) => {
    console.log(ownerId)
    try {
      await sendBarterRequest(itemId, ownerId);
      alert("Barter request sent successfully!");
    } catch (error) {
      console.error("Error sending barter request", error);
      alert("Failed to send barter request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 mt-10 pt-12">
            Items Available in Your City
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/post-item")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md flex items-center"
            >
              Post Item
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md flex items-center"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div 
                key={item._id} 
                className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {item.location}
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                <button 
  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
  onClick={() => navigate(`/item/${item._id}`)} // Navigate to item details
>
  View Details
</button>

                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    onClick={() => handleBarterRequest(item._id,item.userId)}
                  >
                    Barter
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-xl shadow">
              <p className="text-lg text-gray-600">No items available in your city.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
