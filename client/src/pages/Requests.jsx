import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBarterRequests } from "../services/requestService"; // You'll need to create this service

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getBarterRequests(token);
        setRequests(data);
      } catch (error) {
        console.error("Error fetching barter requests", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [token]);

  const handleAcceptRequest = async (requestId) => {
    // Implement the accept request logic here
    console.log("Accept request", requestId);
  };

  const handleRejectRequest = async (requestId) => {
    // Implement the reject request logic here
    console.log("Reject request", requestId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Barter Requests
        </h1>

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
                <div 
                  key={request._id} 
                  className="bg-white border border-gray-200 p-6 rounded-xl shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-3">
                          {request.requesterName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{request.requesterName}</h3>
                          <p className="text-sm text-gray-500">Requested on {new Date(request.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Request for: <span className="text-indigo-600">{request.itemTitle}</span>
                      </h2>
                      
                      <p className="text-gray-600 mb-4">{request.message}</p>
                      
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
                          {request.exchangeType}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Reject
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

                  <button 
                    className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    onClick={() => navigate(`/item/${request.itemId}`)}
                  >
                    View Item Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center p-8 bg-white rounded-xl shadow">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="mt-4 text-lg text-gray-600">No barter requests yet</p>
                  <p className="mt-2 text-sm text-gray-500">When someone wants to barter with your items, their requests will appear here</p>
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