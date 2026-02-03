import { FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar({ sidebarOpen, setSidebarOpen, onProfile }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-[#0f1116] shadow px-4 py-3 flex items-center">
    
      {/* Profile */}
      <div className="relative ml-auto">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2"
        >
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}`
            }
            alt="profile"
            className="w-8 h-8 rounded-full"
          />

          <span className="text-sm font-medium">
            {user?.name || "Admin"}
          </span>

          <FiChevronDown
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg 
                          shadow-lg z-20 border border-gray-100 overflow-hidden">

            {/* USER INFO TOP */}
            <div className="px-4 py-3 border-b bg-gray-50">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@email.com"}
              </p>
            </div>

            {/* Profile */}
            <button
              onClick={() => {
                onProfile?.();
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm 
                         hover:bg-gray-100"
            >
              <FiUser className="mr-2" /> Profile
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm 
                         text-red-600 hover:bg-gray-100"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
