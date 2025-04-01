// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { getReceivedBarterRequests, updateBarterRequestStatus } from "../services/itemService"; 

// const Requests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         setLoading(true);
//         const data = await getReceivedBarterRequests(token);
//         setRequests(data);
//       } catch (error) {
//         console.error("Error fetching barter requests", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchRequests();
//   }, [token]);

//   const handleAcceptRequest = async (requestId) => {
//     try {
//       await updateBarterRequestStatus(requestId, "accepted", token);
//       setRequests((prevRequests) =>
//         prevRequests.map((request) =>
//           request._id === requestId ? { ...request, status: "accepted" } : request
//         )
//       );
//     } catch (error) {
//       console.error("Error accepting barter request", error);
//     }
//   };

//   const handleRejectRequest = async (requestId) => {
//     try {
//       await updateBarterRequestStatus(requestId, "rejected", token);
//       setRequests((prevRequests) =>
//         prevRequests.map((request) =>
//           request._id === requestId ? { ...request, status: "rejected" } : request
//         )
//       );
//     } catch (error) {
//       console.error("Error rejecting barter request", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="max-w-7xl mx-auto p-6 pt-20">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Barter Requests</h1>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {requests.length > 0 ? (
//               requests.map((request) => (
//                 <div key={request._id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-md">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center mb-3">
//                         <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-3">
//                           {request.requesterName.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-gray-800">{request.requesterName}</h3>
//                           <p className="text-sm text-gray-500">
//                             Requested on {new Date(request.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
                      
//                       <h2 className="text-xl font-semibold text-gray-800 mb-2">
//                         Request for: <span className="text-indigo-600">{request.itemTitle}</span>
//                       </h2>
                      
//                       <p className="text-gray-600 mb-4">{request.message}</p>
                      
//                       <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
//                         <h4 className="font-medium text-gray-700 mb-2">Offered in exchange:</h4>
//                         {request.offerDetails ? (
//                           <p className="text-gray-600">{request.offerDetails}</p>
//                         ) : (
//                           <p className="text-gray-500 italic">No specific item offered</p>
//                         )}
//                       </div>
                      
//                       <div className="flex flex-wrap gap-2">
//                         <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                           {request.exchangeType}
//                         </span>
//                         <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
//                           request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           request.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {request.status === 'pending' && (
//                       <div className="flex flex-col sm:flex-row gap-3">
//                         <button
//                           onClick={() => handleAcceptRequest(request._id)}
//                           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
//                         >
//                           ✔ Accept
//                         </button>
//                         <button
//                           onClick={() => handleRejectRequest(request._id)}
//                           className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
//                         >
//                           ✖ Reject
//                         </button>
//                       </div>
//                     )}
                    
//                     {request.status !== 'pending' && (
//                       <div className="text-sm">
//                         <span className={`font-medium ${
//                           request.status === 'accepted' ? 'text-green-600' : 'text-red-600'
//                         }`}>
//                           {request.status === 'accepted' ? 'Accepted' : 'Rejected'} on {new Date(request.updatedAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <button 
//                     className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
//                     onClick={() => navigate(`/item/${request.itemId}`)}
//                   >
//                     View Item Details →
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <div className="flex justify-center items-center p-8 bg-white rounded-xl shadow">
//                 <div className="text-center">
//                   <p className="mt-4 text-lg text-gray-600">No barter requests yet</p>
//                   <p className="mt-2 text-sm text-gray-500">
//                     When someone wants to barter with your items, their requests will appear here
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Requests;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getReceivedBarterRequests, updateBarterRequestStatus } from "../services/itemService"; 

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReceivedBarterRequests(token);
        console.log(data)
        setRequests(data);
      } catch (error) {
        console.error("Error fetching barter requests", error);
        setError("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchRequests();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await updateBarterRequestStatus(requestId, "accepted", token);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: "accepted" } : request
        )
      );
    } catch (error) {
      console.error("Error accepting barter request", error);
      alert("Failed to accept request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await updateBarterRequestStatus(requestId, "rejected", token);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: "rejected" } : request
        )
      );
    } catch (error) {
      console.error("Error rejecting barter request", error);
      alert("Failed to reject request. Please try again.");
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await getReceivedBarterRequests(token);
      setRequests(data);
      setError(null);
    } catch (error) {
      console.error("Error refreshing barter requests", error);
      setError("Failed to refresh. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Barter Requests</h1>
          <button 
            onClick={handleRefresh}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request._id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-3">
                          {request.requesterId.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{request.requesterId.name || "Unknown User"}</h3>
                          <p className="text-sm text-gray-500">
                            Requested on {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Request for: <span className="text-indigo-600">{request.itemId.title || "Item"}</span>
                      </h2>
                      
                      <p className="text-gray-600 mb-4">{request.message || "No message provided"}</p>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2">Offered in exchange:</h4>
                        {request.offerDetails ? (
                          <p className="text-gray-600">{request.offerDetails}</p>
                        ) : (
                          <p className="text-gray-500 italic">No specific item offered</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {request.exchangeType || "Barter"}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || "Unknown"}
                        </span>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                    
                    {request.status !== 'pending' && (
                      <div className="text-sm">
                        <span className={`font-medium ${
                          request.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {request.status === 'accepted' ? 'Accepted' : 'Rejected'} on {new Date(request.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {request.itemId && (
                    <button 
                      className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                      onClick={() => navigate(`/item/${request.itemId._id}`)}
                    >
                      View Item Details →
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center p-8 bg-white rounded-xl shadow">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="mt-4 text-lg text-gray-600">No barter requests yet</p>
                  <p className="mt-2 text-sm text-gray-500">
                    When someone wants to barter with your items, their requests will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;