import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

export default function Service() {
  const [showForm, setShowForm] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [errors, setErrors] = useState({});

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
      console.error("Failed to fetch services", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔹 VALIDATION
  const validate = () => {
    let err = {};

    if (!service.service_name.trim())
      err.service_name = "Service name is required";

    if (!service.service_cost || Number(service.service_cost) <= 0)
      err.service_cost = "Cost must be greater than 0";

    if (!service.service_date)
      err.service_date = "Service date is required";

    if (!service.service_type)
      err.service_type = "Service type is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // 🔹 CREATE SERVICE
  const submit = async () => {
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/api/service", {
        ...service,
        service_cost: Number(service.service_cost),
      });

      fetchServices();
      setShowForm(false);
      setService({
        service_name: "",
        service_cost: "",
        service_date: "",
        service_type: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Failed to create service");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Service Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2"
        >
          <AiOutlinePlus /> Add
        </button>
      </div>

      {showForm && (
        <div className="max-w-lg bg-white p-6 shadow rounded">
          <input
            type="text"
            placeholder="Service Name"
            value={service.service_name}
            onChange={(e) =>
              setService({ ...service, service_name: e.target.value })
            }
            className="border p-2 w-full"
          />
          {errors.service_name && (
            <p className="text-red-500 text-sm">{errors.service_name}</p>
          )}

          <input
            type="number"
            placeholder="Service Cost"
            value={service.service_cost}
            onChange={(e) =>
              setService({ ...service, service_cost: e.target.value })
            }
            className="border p-2 w-full mt-2"
          />
          {errors.service_cost && (
            <p className="text-red-500 text-sm">{errors.service_cost}</p>
          )}

          <input
            type="date"
            value={service.service_date}
            onChange={(e) =>
              setService({ ...service, service_date: e.target.value })
            }
            className="border p-2 w-full mt-2"
          />
          {errors.service_date && (
            <p className="text-red-500 text-sm">{errors.service_date}</p>
          )}

          <select
            value={service.service_type}
            onChange={(e) =>
              setService({ ...service, service_type: e.target.value })
            }
            className="border p-2 w-full mt-2"
          >
            <option value="">Select Service Type</option>
            <option value="AMC">AMC</option>
            <option value="On Demand">On Demand</option>
            <option value="Warranty">Warranty</option>
          </select>
          {errors.service_type && (
            <p className="text-red-500 text-sm">{errors.service_type}</p>
          )}

          <div className="flex gap-2 mt-4">
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

      {!showForm && (
        <table className="w-full border mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 bg-blue-300">ID</th>
              <th className="border p-2 bg-green-300">Service Name</th>
              <th className="border p-2 bg-yellow-300">Cost</th>
              <th className="border p-2 bg-red-300">Date</th>
              <th className="border p-2 bg-pink-300">Type</th>
            </tr>
          </thead>
          <tbody>
          {serviceList.map((s, i) => (
  <tr key={s.id}>
    <td className="border p-2 bg-indigo-300">{i + 1}</td>
    <td className="border p-2 bg-gray-100">{s.service_name}</td>
    <td className="border p-2 bg-gray-100">₹{s.service_cost}</td>
    <td className="border p-2 bg-gray-100">
      {s.service_date?.substring(0, 10)}
    </td>
    <td className="border p-2 bg-gray-100">{s.service_type}</td>
  </tr>
    ))}
    </tbody>
    </table>
    )}
    </div>
  );
}
