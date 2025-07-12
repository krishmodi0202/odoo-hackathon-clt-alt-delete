

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getReceivedBarterRequests, updateBarterRequestStatus,getSentBarterRequests } from "../services/itemService"; 
import { motion } from "framer-motion";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [sentRequests, setSentRequests] = useState([]);

useEffect(() => {
  const fetchSentRequests = async () => {
    try {
      const data = await getSentBarterRequests(token);
      setSentRequests(data);
    } catch (err) {
      console.error("Error fetching sent requests", err);
    }
  };

  if (token) {
    fetchSentRequests();
  }
}, [token]);


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReceivedBarterRequests(token);
        console.log(data);
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
      await updateBarterRequestStatus(requestId, "declined", token);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: "declined" } : request
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
    <div className="min-h-screen bg-[#f8f4f1]">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto p-6 pt-20"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl font-light text-[#5c6154]"
          >
            Barter <span className="italic">Requests</span>
          </motion.h1>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            onClick={handleRefresh}
            className="bg-[#5c6154] text-white px-4 py-2 rounded-sm hover:bg-[#4a4e42] transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </motion.button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm mb-4"
          >
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c6154]"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <motion.div 
                  key={request._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white border border-[#e2e1d9] p-6 rounded-sm shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#e2e1d9] flex items-center justify-center text-[#5c6154] font-bold mr-3">
                          {request.requesterId.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="font-light text-[#5c6154]">{request.requesterId.name || "Unknown User"}</h3>
                          <p className="text-sm text-gray-500">
                            Requested on {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-light text-[#5c6154] mb-2">
                        Request for: <span className="italic">{request.itemId.title || "Item"}</span>
                      </h2>
                      
                      <p className="text-gray-600 mb-4">{request.message || "No message provided"}</p>
                      
                      <div className="bg-[#f8f4f1] p-4 rounded-sm mb-4 border border-[#e2e1d9]">
                        <h4 className="font-light text-[#5c6154] mb-2">Offered in exchange:</h4>
                        {request.offerDetails ? (
                          <p className="text-gray-600">{request.offerDetails}</p>
                        ) : (
                          <p className="text-gray-500 italic">No specific item offered</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#e2e1d9] text-[#5c6154] text-xs px-2.5 py-0.5">
                          {request.exchangeType || "Barter"}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 ${
                          request.status === 'pending' ? 'bg-[#e2e1d9] text-[#5c6154]' :
                          request.status === 'accepted' ? 'bg-[#d1e7dd] text-[#0f5132]' :
                          'bg-[#f8d7da] text-[#842029]'
                        }`}>
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || "Unknown"}
                        </span>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="bg-[#5c6154] text-white px-4 py-2 rounded-sm hover:bg-[#4a4e42] transition-colors flex items-center justify-center"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="border border-[#5c6154] text-[#5c6154] px-4 py-2 rounded-sm hover:bg-[#5c6154] hover:text-white transition-colors flex items-center justify-center"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                    
                    {request.status !== 'pending' && (
                      <div className="text-sm">
                        <span className={`font-light ${
                          request.status === 'accepted' ? 'text-[#0f5132]' : 'text-[#842029]'
                        }`}>
                          {request.status === 'accepted' ? 'Accepted' : 'Rejected'} on {new Date(request.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {request.itemId && (
                    <button 
                      className="mt-4 text-sm text-[#5c6154] hover:underline font-light flex items-center"
                      onClick={() => navigate(`/item/${request.itemId._id}`)}
                    >
                      View Item Details →
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center items-center p-8 bg-white border border-[#e2e1d9] rounded-sm shadow-sm"
              >
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="mt-4 text-lg text-[#5c6154] font-light">No barter requests yet</p>
                  <p className="mt-2 text-sm text-gray-500">
                    When someone wants to barter with your items, their requests will appear here
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="mt-16"
>
  <h2 className="text-2xl font-light text-[#5c6154] mb-6">Sent <span className="italic">Requests</span></h2>

  {sentRequests.length > 0 ? (
    sentRequests.map((request, index) => (
      <motion.div
        key={request._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="bg-white border border-[#e2e1d9] p-6 rounded-sm shadow-sm mb-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-light text-[#5c6154]">
              You requested to barter for: <span className="italic">{request.itemId?.title || "Item"}</span>
            </h3>
            <p className="text-sm text-gray-500">
              Owner: {request.ownerId?.name || "Unknown"} | Sent on {new Date(request.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-600">{request.message}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-[#e2e1d9] text-[#5c6154] text-xs px-2.5 py-0.5">
                {request.exchangeType || "Barter"}
              </span>
              <span className={`text-xs px-2.5 py-0.5 ${
                request.status === 'pending' ? 'bg-[#e2e1d9] text-[#5c6154]' :
                request.status === 'accepted' ? 'bg-[#d1e7dd] text-[#0f5132]' :
                'bg-[#f8d7da] text-[#842029]'
              }`}>
                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || "Unknown"}
              </span>
            </div>
          </div>
          {request.itemId && (
            <button 
              className="mt-4 text-sm text-[#5c6154] hover:underline font-light flex items-center"
              onClick={() => navigate(`/item/${request.itemId._id}`)}
            >
              View Item Details →
            </button>
          )}
        </div>
      </motion.div>
    ))
  ) : (
    <div className="text-center text-[#5c6154] font-light italic">
      You haven’t sent any barter requests yet.
    </div>
  )}
</motion.div>

    </div>
  );
};

export default Requests;