import axios from "axios";
import { useEffect, useState } from "react";

export default function Amc() {
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);
  const [amcList, setAmcList] = useState([]);

  const [amc, setAmc] = useState({
    customer_id: "",
    start_date: "",
    end_date: "",
    amount: "",
    status: "Paid",
  });

  // 🔹 FETCH AMC LIST
  const fetchAmc = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/amc");
      setAmcList(res.data);
    } catch (err) {
      console.error("Failed to load AMC");
    }
  };

  // 🔹 LOAD AMC ON PAGE LOAD & RELOAD
  useEffect(() => {
    fetchAmc();
  }, [reload]);

  // 🔹 CREATE AMC
  const submit = async () => {
    try {
      await axios.post("http://localhost:5000/api/amc", amc);

      setShowForm(false);
      setReload((prev) => !prev);

      setAmc({
        customer_id: "",
        start_date: "",
        end_date: "",
        amount: "",
        status: "Paid",
      });
    } catch (err) {
      alert("Failed to create AMC");
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">AMC Management</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white w-10 h-10 rounded-full text-2xl"
        >
          +
        </button>
      </div>

      {/* AMC FORM */}
      {showForm && (
        <div className="max-w-md bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Create AMC</h3>

          <input
            type="number"
            placeholder="Customer ID"
            value={amc.customer_id}
            onChange={(e) =>
              setAmc({ ...amc, customer_id: e.target.value })
            }
            className="border p-2 w-full mb-3"
          />

          <input
            type="date"
            value={amc.start_date}
            onChange={(e) =>
              setAmc({ ...amc, start_date: e.target.value })
            }
            className="border p-2 w-full mb-3"
          />

          <input
            type="date"
            value={amc.end_date}
            onChange={(e) =>
              setAmc({ ...amc, end_date: e.target.value })
            }
            className="border p-2 w-full mb-3"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amc.amount}
            onChange={(e) =>
              setAmc({ ...amc, amount: e.target.value })
            }
            className="border p-2 w-full mb-3"
          />

          <select
            value={amc.status}
            onChange={(e) =>
              setAmc({ ...amc, status: e.target.value })
            }
            className="border p-2 w-full mb-4"
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={submit}
              className="bg-blue-600 text-white flex-1 py-2 rounded"
            >
              Create AMC
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white flex-1 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* AMC TABLE */}
      {!showForm && (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Customer ID</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {amcList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No AMC Records Found
                  </td>
                </tr>
              ) : (
                amcList.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.customer_id}</td>
                    <td className="border p-2">{item.start_date}</td>
                    <td className="border p-2">{item.end_date}</td>
                    <td className="border p-2">₹{item.amount}</td>
                    <td
                      className={`border p-2 font-semibold ${
                        item.status === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
