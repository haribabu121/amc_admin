// src/components/admin/ManageStaff.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ManageStaff({ reload }) {
  const [staff, setStaff] = useState([]);
  const [edit, setEdit] = useState(null);

  // LOAD STAFF
  const loadStaff = async () => {
    const res = await axios.get("http://localhost:5000/api/staff");
    setStaff(res.data);
  };

  useEffect(() => {
    loadStaff();
  }, [reload]);

  // UPDATE STAFF
  const updateStaff = async () => {
    await axios.put(
      `http://localhost:5000/api/staff/${edit.id}`,
      edit
    );
    setEdit(null);
    loadStaff();
  };

  // DELETE STAFF
  const deleteStaff = async (id) => {
    if (!window.confirm("Delete staff?")) return;
    await axios.delete(`http://localhost:5000/api/staff/${id}`);
    loadStaff();
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Staff List</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 font-normal">ID</th>
            <th className="border p-2 font-normal">Name</th>
            <th className="border p-2 font-normal">Email</th>
            <th className="border p-2 font-normal">Phone</th>
            <th className="border p-2 font-normal">Actions</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((s, index) => (
            <tr key={s.id} className="text-center">
              <td className="border p-2">{index+1}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.phone}</td>
              <td className="border p-2 justify-center gap-6">
                <button
                  onClick={() => setEdit({ ...s })}
                  className="text-blue-600"
                >
                  <FiEdit />
                </button>

                <button
                  onClick={() => deleteStaff(s.id)}
                  className="text-red-600"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= EDIT MODAL ================= */}
      {edit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Staff</h3>

            <input
              value={edit.name}
              onChange={(e) =>
                setEdit({ ...edit, name: e.target.value })
              }
              className="border p-2 w-full mb-3"
              placeholder="Name"
            />

            <input
              value={edit.email}
              onChange={(e) =>
                setEdit({ ...edit, email: e.target.value })
              }
              className="border p-2 w-full mb-3"
              placeholder="Email"
            />

            <input
              value={edit.phone}
              onChange={(e) =>
                setEdit({ ...edit, phone: e.target.value })
              }
              className="border p-2 w-full mb-4"
              placeholder="Phone"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEdit(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateStaff}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================================================= */}
    </div>
  );
}
