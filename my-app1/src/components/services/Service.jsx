import axios from "axios";
import { useEffect, useState } from "react";

export default function Service() {
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);
  const [serviceList, setServiceList] = useState([]);

  const [service, setService] = useState({
    service_name: "",
    service_cost: "",
    service_date: "",
    service_type: "",
  });

  // 🔹 FETCH SERVICES
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/service");
      setServiceList(res.data);
    } catch (err) {
      console.error("Failed to load services");
    }
  };

  // 🔹 LOAD ON PAGE LOAD & RELOAD
  useEffect(() => {
    fetchServices();
  }, [reload]);

  // 🔹 CREATE SERVICE
  const submit = async () => {
    try {
      await axios.post("http://localhost:5000/api/service", service);

      setShowForm(false);
      setReload((prev) => !prev);

      setService({
        service_name: "",
        service_cost: "",
        service_date: "",
        service_type: "",
      });
    } catch (err) {
      alert("Failed to create Service");
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Service Management</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white w-10 h-10 rounded-full text-2xl"
        >
          +
        </button>
      </div>

      {/* SERVICE FORM */}
      {showForm && (
        <div className="max-w-md bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Create Service</h3>

          <input
            type="text"
            placeholder="Service Name"
            value={service.service_name}
            onChange={(e) =>
              setService({ ...service, service_name: e.target.value })
            }
            className="border p-2 w-full mb-3"
          />

          <input
            type="number"
            placeholder="Service Cost"
            value={service.service_cost}
            onChange={(e) =>
              setService({ ...service, service_cost: e.target.value })
            }
            className="border p-2 w-full mb-3"
          />

          <input
            type="date"
            value={service.service_date}
            onChange={(e) =>
              setService({ ...service, service_date: e.target.value })
            }
            className="border p-2 w-full mb-3"
          />

          <select
            value={service.service_type}
            onChange={(e) =>
              setService({ ...service, service_type: e.target.value })
            }
            className="border p-2 w-full mb-4"
          >
            <option value="">Select Service Type</option>
            <option value="AMC">AMC</option>
            <option value="On Demand">On Demand</option>
            <option value="Warranty">Warranty</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={submit}
              className="bg-blue-600 text-white flex-1 py-2 rounded"
            >
              Create Service
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

      {/* SERVICE TABLE */}
      {!showForm && (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Service Name</th>
                <th className="border p-2">Cost</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {serviceList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No Services Found
                  </td>
                </tr>
              ) : (
                serviceList.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.service_name}</td>
                    <td className="border p-2">₹{item.service_cost}</td>
                    <td className="border p-2">{item.service_date}</td>
                    <td className="border p-2 font-medium">
                      {item.service_type}
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
