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

const MyBarter = () => {
  const [items, setItems] = useState([]);
  const [barterRequests, setBarterRequests] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const userItems = await getUserItems(token);
        setItems(userItems);
      } catch (error) {
        console.error("Error fetching user items:", error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Barter Items</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{item.category}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{item.location}</span>
                </div>

                <div className="flex space-x-4 mt-4">
                  <button 
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
                    onClick={() => navigate(`/edit-item/${item._id}`)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-xl shadow">
            <div className="text-center">
              <p className="mt-4 text-lg text-gray-600">You haven't posted any items yet.</p>
              <button
                onClick={() => navigate("/post-item")}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
              >
                Post an Item
              </button>
            </div>
          </div>
        )}

        {/* 📌 Barter Requests Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Barter Requests</h2>

          {barterRequests.length > 0 ? (
            <div className="space-y-4">
              {barterRequests.map((request) => (
                <div key={request._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-md">
                  <p><strong>Requester:</strong></p>
                  <p><strong>Item:</strong> {request.itemId.title}</p>
                  <p><strong>Status:</strong> {request.status}</p>

                  <div className="flex space-x-4 mt-2">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                      onClick={() => handleRequestAction(request._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                      onClick={() => handleRequestAction(request._id, "declined")}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No barter requests received.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBarter;
