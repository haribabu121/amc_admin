// src/components/admin/ManageStaff.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
    alert("Staff updated!");
    loadStaff();
  };

  // DELETE STAFF
  const deleteStaff = async (id) => {
    if (!window.confirm("Delete staff?")) return;
    await axios.delete(`http://localhost:5000/api/staff/${id}`);
    alert("Staff deleted!");
    loadStaff();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold mb-4">Staff List</h2>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="p-3 font-normal bg-blue-500 text-white border-b border-black">
                ID
              </th>
              <th className="p-3 font-normal bg-orange-400 text-white border-b border-black">
                Name
              </th>
              <th className="p-3 font-normal bg-green-500 text-white border-b border-black">
                Email
              </th>
              <th className="p-3 font-normal bg-purple-500 text-white border-b border-black">
                Phone
              </th>
              <th className="p-3 font-normal bg-red-500 text-white border-b border-black">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {staff.map((s, index) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "#e010bedc",
                  }}
                  className="text-center"
                >
                  <td className="p-3 bg-yellow-200 border-b border-gray-300">
                    {index + 1}
                  </td>
                  <td className="p-3 bg-gray-100 border-b border-gray-300">
                    {s.name}
                  </td>
                  <td className="p-3 bg-gray-100 border-b border-gray-300">
                    {s.email}
                  </td>
                  <td className="p-3 bg-gray-100 border-b border-gray-300">
                    {s.phone}
                  </td>
                  <td className="p-3 bg-gray-100 border-b border-gray-300">
                    <div className="flex justify-center gap-6">
                      {/* EDIT */}
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEdit({ ...s })}
                        className="text-blue-600"
                      >
                        <FiEdit size={18} />
                      </motion.button>

                      {/* DELETE */}
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteStaff(s.id)}
                        className="text-red-600"
                      >
                        <FiTrash2 size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ================= EDIT MODAL ================= */}
      <AnimatePresence>
        {edit && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="bg-white p-6 rounded-xl w-96 shadow-2xl"
            >
              <h3 className="text-lg font-semibold mb-4">
                Edit Staff
              </h3>

              <motion.input
                whileFocus={{ scale: 1.02 }}
                value={edit.name}
                onChange={(e) =>
                  setEdit({ ...edit, name: e.target.value })
                }
                className="border p-2 w-full mb-3 rounded"
                placeholder="Name"
              />

              <motion.input
                whileFocus={{ scale: 1.02 }}
                value={edit.email}
                onChange={(e) =>
                  setEdit({ ...edit, email: e.target.value })
                }
                className="border p-2 w-full mb-3 rounded"
                placeholder="Email"
              />

              <motion.input
                whileFocus={{ scale: 1.02 }}
                value={edit.phone}
                onChange={(e) =>
                  setEdit({ ...edit, phone: e.target.value })
                }
                className="border p-2 w-full mb-4 rounded"
                placeholder="Phone"
              />

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEdit(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={updateStaff}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
