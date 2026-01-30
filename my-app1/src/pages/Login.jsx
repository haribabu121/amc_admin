import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

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

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    regNo: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    regNo: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    regNo: false,
    password: false,
  });

  useEffect(() => {
    addAnimation();
  }, []);

  // Regex
  const regNoRegex = /^\d{12}$/;
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  // Registration Number handler
  const handleRegNoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 12) return;

    setForm({ ...form, regNo: value });

    if (touched.regNo) {
      setErrors({
        ...errors,
        regNo:
          value.length !== 12
            ? "Registration number must be 12 digits"
            : "",
      });
    }
  };

  // Password handler
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, password: value });

    if (touched.password) {
      setErrors({
        ...errors,
        password: !passwordRegex.test(value)
          ? "Password must be at least 8 characters and include a special character"
          : "",
      });
    }
  };

  // Login
  const login = async () => {
    setTouched({ regNo: true, password: true });

    let valid = true;

    if (!regNoRegex.test(form.regNo)) {
      setErrors((prev) => ({
        ...prev,
        regNo: "Registration number must be 12 digits",
      }));
      valid = false;
    }

    if (!passwordRegex.test(form.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters and include a special character",
      }));
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        {
          registration: form.regNo,
          password: form.password,
        },
        { withCredentials: true }
      );

      const role = res.data.Role;

      if (role === "admin") {
        navigate("/dashboard", { replace: true });
        alert("successfully logged in")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 p-4">
      <div className="relative group w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 animate-tilt"></div>

        <div className="relative bg-white p-8 rounded-md shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Login</h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Registration Number"
            value={form.regNo}
            onChange={handleRegNoChange}
            onBlur={() =>
              setTouched((prev) => ({ ...prev, regNo: true }))
            }
          />
          {touched.regNo && errors.regNo && (
            <p className="text-red-500 text-sm mb-2">{errors.regNo}</p>
          )}

          <input
            className="border p-2 w-full mb-2"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handlePasswordChange}
            onBlur={() =>
              setTouched((prev) => ({ ...prev, password: true }))
            }
          />
          {touched.password && errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password}</p>
          )}

          <button
            className="bg-blue-600 text-white w-full p-2 mt-2 disabled:opacity-50"
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
