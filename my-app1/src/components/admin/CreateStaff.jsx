// src/components/admin/CreateStaff.jsx
import axios from "axios";
import { useState } from "react";
import ManageStaff from "./ManageStaff";

export default function CreateStaff() {
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);

  const [staff, setStaff] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    await axios.post("http://localhost:5000/api/staff", staff);

    // ✅ CLOSE FORM
    setShowForm(false);

    // ✅ REFRESH TABLE
    setReload(prev => !prev);

    // ✅ CLEAR FORM
    setStaff({ name: "", phone: "", email: "", password: "" });
  };

  return (
    <div className="relative p-6">

      {/* TOP RIGHT BUTTON */}
      <div className="absolute top-0 right-0 flex items-center gap-2">
        <h3 className="text-lg font-semibold">Add Staff</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white w-10 h-10 rounded-full text-2xl"
        >
          +
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="max-w-md bg-white p-6 rounded shadow mt-12">
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
