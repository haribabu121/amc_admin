import axios from "axios";
import { useState, useEffect } from "react";

/* 🔥 Same animation used in Registration */
const addAnimation = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .animate-tilt {
      animation: rotate 6s linear infinite;
    }
    .animate-tilt:hover {
      animation: rotate 3s linear infinite;
    }
  `;
  document.head.appendChild(style);
};

export default function AdminDashboard() {
  const [staff, setStaff] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    addAnimation();
  }, []);

  const createStaff = async () => {
    await axios.post("http://localhost:5000/api/create-staff", staff);
    alert("Staff Created");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 p-4">
      <div className="relative group w-full max-w-md">
        {/* 🔥 Glowing animated border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 animate-tilt"></div>

        {/* 🔥 Card */}
        <div className="relative bg-white p-8 rounded-lg shadow-2xl w-full">
          <h2 className="text-2xl font-bold text-center mb-6">
            Admin – Create Staff
          </h2>

          <div className="space-y-4">
            <input
              placeholder="Name"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) =>
                setStaff({ ...staff, name: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) =>
                setStaff({ ...staff, phone: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) =>
                setStaff({ ...staff, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) =>
                setStaff({ ...staff, password: e.target.value })
              }
            />

            <button
              onClick={createStaff}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Create Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
