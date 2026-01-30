// src/components/admin/CreateStaff.jsx
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
   // 🔹 VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};

    if (!staff.name.trim()) {
      newErrors.name = "Name is required";
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
    } else if (staff.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const submit = async () => {
    if (!validate()) return;
    try 
    {await axios.post("http://localhost:5000/api/staff", staff);

    // ✅ CLOSE FORM
    setShowForm(false);

    // ✅ REFRESH TABLE
    setReload(prev => !prev);

    // ✅ CLEAR FORM
    setStaff({ name: "", phone: "", email: "", password: "" });
    setErrors({});
    } catch (err) {
      console.error("Failed to create staff");
    }
  };

  return (
    <div className="relative p-6">

      {/* TOP RIGHT BUTTON */}
      <div className="absolute top-0 right-0 flex items-center gap-2">
        <button
  onClick={() => setShowForm(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded 
             flex items-center gap-2 mt-6 hover:bg-blue-700 transition"
>
  <AiOutlinePlus />
  Add
</button>
      </div>

      {/* CREATE FORM
      {showForm && (
        <div className="max-w-lg ml-55 mt-20 bg-white p-6 rounded shadow mt-12">
          <h2 className="text-lg font-semibold mb-4">Create Staff</h2>

          {Object.keys(staff).map((key) => (
            <input
              key={key}
              type={key === "password" ? "password" : "text"}
              placeholder={key.toUpperCase()}
              value={staff[key]}
              onChange={(e) =>
                setStaff({ ...staff, [key]: e.target.value })
              }
              className="border p-2 w-full mb-3"
            />
          ))}

          <button
            onClick={submit}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Create Staff
          </button>
        </div>
      )} */}
      {/* CREATE FORM */}
{showForm && (
  <div className="max-w-lg ml-55 mt-20 bg-white p-6 rounded shadow">
    <h2 className="text-lg font-semibold mb-4">Create Staff</h2>

    {Object.keys(staff).map((key) => (
      <div key={key} className="mb-3">
        <input
          type={key === "password" ? "password" : "text"}
          placeholder={key.toUpperCase()}
          value={staff[key]}
          onChange={(e) =>
            setStaff({ ...staff, [key]: e.target.value })
          }
          className={`border p-2 w-full rounded 
            ${errors[key] ? "border-red-500" : "border-gray-300"}`}
        />

        {/* 🔴 ERROR MESSAGE */}
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

      {/* 🔥 TABLE OPENS AFTER FORM CLOSES */}
      {!showForm && (
        <div className="mt-16">
          <ManageStaff reload={reload} />
        </div>
      )}
    </div>
  );
}
