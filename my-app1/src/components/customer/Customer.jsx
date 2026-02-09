import { useEffect, useState } from "react";

export default function Customer() {
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    email: "",
    address: "",
    service_id: "",
    gst_no: "",
    advance_payment: "",
    purchase_date: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchServices();
    fetchCustomers();
  }, []);

  const fetchServices = async () => {
    const res = await fetch("http://localhost:5000/api/service");
    const data = await res.json();
    setServices(data);
  };

  const fetchCustomers = async () => {
    const res = await fetch("http://localhost:5000/api/customer");
    const data = await res.json();
    setCustomers(data);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    let newErrors = {};

    // Name: letters only, max 15
    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (!/^[A-Za-z ]+$/.test(formData.name))
      newErrors.name = "Name must contain only letters";
    else if (formData.name.length > 15)
      newErrors.name = "Name must be max 15 characters";

    // Phone: exactly 10 digits
    if (!formData.phonenumber.trim()) newErrors.phonenumber = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phonenumber))
      newErrors.phonenumber = "Phone must be 10 digits";

    // Email: optional, but if filled must be valid
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    // GST No: optional, if filled must be 15 alphanumeric characters
    if (formData.gst_no && !/^[0-9A-Za-z]{15}$/.test(formData.gst_no))
      newErrors.gst_no = "GST must be 15 alphanumeric characters";

    // Advance payment: digits only
    if (formData.advance_payment && !/^\d+$/.test(formData.advance_payment))
      newErrors.advance_payment = "Advance must be digits only";

    // Purchase date: required
    if (!formData.purchase_date) newErrors.purchase_date = "Purchase date is required";

    // Service: required
    if (!formData.service_id) newErrors.service_id = "Service is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict input live for name, phone, advance, GST
    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) return;
      if (value.length > 15) return;
    }
    if (name === "phonenumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    if (name === "advance_payment") {
      if (!/^\d*$/.test(value)) return;
    }
    if (name === "gst_no") {
      if (!/^[0-9A-Za-z]*$/.test(value)) return;
      if (value.length > 15) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error immediately when corrected
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      service_id: Number(formData.service_id),
      advance_payment: Number(formData.advance_payment || 0),
    };

    const res = await fetch("http://localhost:5000/api/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Submit failed");
      return;
    }

    await fetchCustomers();
    setShowForm(false);
    setFormData({
      name: "",
      phonenumber: "",
      email: "",
      address: "",
      service_id: "",
      gst_no: "",
      advance_payment: "",
      purchase_date: "",
    });
    setErrors({});
    alert("Customer added successfully");
  };

  /* ================= FORMAT DATE ================= */
  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toISOString().slice(0, 10) : "";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ADD CUSTOMER BUTTON */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 ml-252 rounded"
        >
          Add Customer
        </button>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md space-y-3">
          <h2 className="text-lg font-bold">Add Customer</h2>

          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border p-2 ${errors.name ? "border-red-500" : ""}`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            name="phonenumber"
            placeholder="Phone"
            value={formData.phonenumber}
            onChange={handleChange}
            className={`w-full border p-2 ${errors.phonenumber ? "border-red-500" : ""}`}
            required
          />
          {errors.phonenumber && <p className="text-red-500 text-sm">{errors.phonenumber}</p>}

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border p-2 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2"
          />

          <select
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            className={`w-full border p-2 ${errors.service_id ? "border-red-500" : ""}`}
            required
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.service_name}
              </option>
            ))}
          </select>
          {errors.service_id && <p className="text-red-500 text-sm">{errors.service_id}</p>}

          <input
            type="text"
            name="gst_no"
            placeholder="GST Number"
            value={formData.gst_no}
            onChange={handleChange}
            className={`w-full border p-2 ${errors.gst_no ? "border-red-500" : ""}`}
          />
          {errors.gst_no && <p className="text-red-500 text-sm">{errors.gst_no}</p>}

          <input
            type="text"
            name="advance_payment"
            placeholder="Advance Payment"
            value={formData.advance_payment}
            onChange={handleChange}
            className={`w-full border p-2 ${errors.advance_payment ? "border-red-500" : ""}`}
          />
          {errors.advance_payment && <p className="text-red-500 text-sm">{errors.advance_payment}</p>}

          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className={`w-full border p-2 ${errors.purchase_date ? "border-red-500" : ""}`}
            required
          />
          {errors.purchase_date && <p className="text-red-500 text-sm">{errors.purchase_date}</p>}

          <button className="w-full bg-blue-600 text-white py-2 rounded">Submit</button>
        </form>
      )}

      {/* ================= TABLE ================= */}
      {!showForm && (
        <div>
          <h2 className="text-lg font-bold mb-3">Customers</h2>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 bg-yellow-200 border-b border-gray-300 bg-red-300">Name</th>
                <th className="p-3  border-b border-gray-300 bg-orange-400">Phone</th>
                <th className="p-3  border-b border-gray-300 bg-yellow-300">Email</th>
                <th className="p-3  border-b border-gray-300 bg-green-300">Service</th>
                <th className="p-3 border-b border-gray-300 bg-blue-300">GST No</th>
                <th className="p-3  border-b border-gray-300 bg-purple-300">Advance</th>
                <th className="p-3  border-b border-gray-300 bg-indigo-300">Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.customer_id}>
                    <td className=" p-3 bg-gray-100 border-b border-gray-300">{c.name}</td>
                    <td className="p-3 bg-gray-100 border-b border-gray-300">{c.phonenumber}</td>
                    <td className="p-3 bg-gray-100 border-b border-gray-300">{c.email}</td>
                    <td className="p-3 bg-gray-100 border-b border-gray-300">{c.service_name}</td>
                    <td className="p-3 bg-gray-100 border-b border-gray-300">{c.gst_no}</td>
                    <td className="p-3 bg-gray-100 border-b border-gray-300">{c.advance_payment}</td>
                    <td className="p-3 bg-gray-100 border-b border-gray-300">{formatDate(c.purchase_date)}</td>
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
