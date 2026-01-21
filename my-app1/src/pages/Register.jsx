import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Add custom animation
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

export default function Registration() {
  const navigate = useNavigate();

  useEffect(() => {
    addAnimation();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ COMMON CHANGE HANDLER
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};
    if (!formData.name) err.name = "Name required";
    if (!formData.email) err.email = "Email required";
    if (!formData.phone) err.phone = "Phone required";
    if (!formData.password || formData.password.length < 6)
      err.password = "Min 6 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration Successful 🎉");
      navigate("/login");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 p-4">
      <div className="relative group w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 animate-tilt"></div>

        <div className="relative bg-white p-8 rounded-lg shadow-2xl w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <input
              name="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <input
              name="phone"
              placeholder="Phone"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition-all duration-300">
              Register
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
