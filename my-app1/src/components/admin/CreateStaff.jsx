import axios from "axios";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ManageStaff from "./ManageStaff";

export default function CreateStaff() {
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);
  const [errors, setErrors] = useState({});

  const [staff, setStaff] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  /* =========================
        LIVE INPUT HANDLER
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // NAME: letters + space, max 15
    if (name === "name") {
      if (!/^[A-Za-z\s]*$/.test(value)) return;
      if (value.length > 15) return;
    }

    // PHONE: digits only, max 10
    if (name === "phone") {
      if (!/^[0-9]*$/.test(value)) return;
      if (value.length > 10) return;
    }

    // PASSWORD: no spaces, max 8
    if (name === "password") {
      if (/\s/.test(value)) return;
      if (value.length > 8) return;
    }

    // UPDATE STATE
    setStaff((prev) => ({ ...prev, [name]: value }));

    // REMOVE ERROR WHEN VALID
    setErrors((prev) => {
      const newErrors = { ...prev };

      if (name === "name" && value.trim() && value.length <= 15) {
        delete newErrors.name;
      }

      if (name === "phone" && /^[0-9]{10}$/.test(value)) {
        delete newErrors.phone;
      }

      if (name === "email" && /^\S+@\S+\.\S+$/.test(value)) {
        delete newErrors.email;
      }

      if (
        name === "password" &&
        value.length === 8 &&
        /[@$!%*?&]/.test(value)
      ) {
        delete newErrors.password;
      }

      return newErrors;
    });
  };

  /* =========================
        SUBMIT VALIDATION
  ========================= */
  const validate = () => {
    let newErrors = {};

    if (!staff.name.trim()) {
      newErrors.name = "Name is required";
    } else if (staff.name.length > 15) {
      newErrors.name = "Name must be max 15 characters";
    }

    if (!staff.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(staff.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!staff.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(staff.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!staff.password.trim()) {
      newErrors.password = "Password is required";
    } else if (
      staff.password.length !== 8 ||
      !/[@$!%*?&]/.test(staff.password)
    ) {
      newErrors.password =
        "Password must be 8 characters and contain a special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
            SUBMIT
  ========================= */
  const submit = async () => {
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/api/staff", staff);

      setShowForm(false);
      setReload((prev) => !prev);
      setStaff({ name: "", phone: "", email: "", password: "" });
      setErrors({});
    } catch (err) {
      console.error("Failed to create staff", err);
    }
  };

  return (
    <div className="relative p-6">
      {/* ADD BUTTON */}
      <div className="absolute top-0 right-0">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded 
                     flex items-center gap-2 mt-6 hover:bg-blue-700 transition"
        >
          <AiOutlinePlus />
          Add
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="max-w-lg ml-55 mt-20 bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Create Staff</h2>

          {Object.keys(staff).map((key) => (
            <div key={key} className="mb-3">
              <input
                name={key}
                type={
                  key === "password"
                    ? "password"
                    : key === "phone"
                    ? "tel"
                    : "text"
                }
                placeholder={key.toUpperCase()}
                value={staff[key]}
                onChange={handleChange}
                maxLength={
                  key === "name" ? 15 : key === "phone" ? 10 : undefined
                }
                inputMode={key === "phone" ? "numeric" : undefined}
                className={`border p-2 w-full rounded
                  ${errors[key] ? "border-red-500" : "border-gray-300"}`}
              />

              {errors[key] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[key]}
                </p>
              )}
            </div>
          ))}

          <button
            onClick={submit}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Create Staff
          </button>
        </div>
      )}

      {/* STAFF TABLE */}
      {!showForm && (
        <div className="mt-16">
          <ManageStaff reload={reload} />
        </div>
      )}
    </div>
  );
}
