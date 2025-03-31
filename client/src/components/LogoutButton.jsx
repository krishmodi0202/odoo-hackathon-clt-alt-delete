import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4">
      Logout
    </button>
  );
};

export default LogoutButton;
