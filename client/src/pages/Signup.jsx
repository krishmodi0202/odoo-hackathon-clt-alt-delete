// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signup } from "../services/authService";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     location: "",
//     contact: "", // New field for contact
//   });

//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await signup(formData);
//       // localStorage.setItem("token", data.token);
//       // localStorage.setItem("user", JSON.stringify(data.user));
//       navigate("/login");
//     } catch (err) {
//       setError(err);
//     }
//   };

  
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h2 className="text-2xl mb-4">Signup</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
//         <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//         <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//         <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
//         <input type="text" name="contact" placeholder="Contact Number" onChange={handleChange} required />
//         <button type="submit" className="bg-blue-500 text-white py-2">Signup</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    contact: "", // New field for contact
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(formData);
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/login");
    } catch (err) {
      setError(err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Bizora Logo" 
            className="h-12 w-40" 
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Create Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input 
              type="text" 
              id="name"
              name="name" 
              placeholder="Enter your full name" 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              name="email" 
              placeholder="Enter your email" 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Create a password" 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="location">
              Location
            </label>
            <input 
              type="text" 
              id="location"
              name="location" 
              placeholder="Enter your location" 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="contact">
              Contact Number
            </label>
            <input 
              type="text" 
              id="contact"
              name="contact" 
              placeholder="Enter your contact number" 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Sign Up
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <span
              className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-800"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;