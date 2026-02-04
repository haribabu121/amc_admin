import { FiLogOut, FiUser, FiChevronDown, FiMenu } from "react-icons/fi";
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
    <header className="bg-[#0f1116] px-4 py-3 flex items-center shadow">
      
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-white text-xl lg:hidden"
      >
        <FiMenu />
      </button>

      {/* PROFILE */}
      <div className="relative ml-auto">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-white"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "Admin"
            )}`}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden sm:block">{user?.name || "Admin"}</span>
          <FiChevronDown
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow z-50">
            <div className="px-4 py-3 border-b">
              <p className="font-semibold">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500">
                {user?.email || "admin@email.com"}
              </p>
            </div>

            <button
              onClick={() => {
                onProfile?.();
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
            >
              <FiUser className="mr-2" /> Profile
            </button>

            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
