import { useEffect, useState } from "react";
// import { FiEdit } from "react-icons/fi";
export default function Customer() {
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    email: "",
    address: "",
    service_id: "",
    gst_no:"",
    advance_payment: "",
    purchase_date: "",
  });


/* ================= HELPERS ================= */

  const generateInvoiceNumber = () => {
    const d = new Date();
    return `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(d.getDate()).padStart(2, "0")}-${Math.floor(
      100 + Math.random() * 900
    )}`;
  };



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
    console.log(data);
    setCustomers(data);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // reload table FIRST
    await fetchCustomers();

    // close form
    setShowForm(false);

    //  reset form
    setFormData({
      name: "",
      phonenumber: "",
      email: "",
      address: "",
      service_id: "",
      gst_no:"",
      advance_payment: "",
      purchase_date: "",
    });

    alert("Customer added successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
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
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md max-w-md space-y-3"
          >
            <h2 className="text-lg font-bold">Add Customer</h2>

            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2"
              required
            />

            <input
              name="phonenumber"
              placeholder="Phone"
              value={formData.phonenumber}
              onChange={handleChange}
              className="w-full border p-2"
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2"
            />

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
              className="w-full border p-2"
              required
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.service_name}
                </option>
              ))}
            </select>
<input
  type="text"
  placeholder="Enter GST Number"
  value={formData.gst_no}
  className="w-full border p-2"
  onChange={(e) =>
    setFormData({ ...formData, gst_no: e.target.value })
  }
/>
            <input
              type="number"
              name="advance_payment"
              placeholder="Advance Payment"
              value={formData.advance_payment}
              onChange={handleChange}
              className="w-full border p-2"
            />

            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              className="w-full border p-2"
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              Submit
            </button>
          </form>
        )}

        {/* ================= TABLE ================= */}
        {!showForm && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-3">Customers</h2>

            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Service</th>
                  <th className="border p-2">Gst No</th>
                  <th className="border p-2">purchase_price</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.customer_id}>
                      <td className="border p-2">{c.name}</td>
                      <td className="border p-2">{c.phonenumber}</td>
                      <td className="border p-2">{c.email}</td>
                      <td className="border p-2">{c.service_name}</td>
                      <td className="border p-2">{c.gst_no}</td>
                      <td className="border p-2">{c.advance_payment}</td>
                      <td className="border p-2">
  {new Date(c.purchase_date).toISOString().slice(0, 10)}
</td>
<td className="border p-2 justify-center gap-6">
                <button
                  onClick={() => setEdit({ ...s })}
                  className="text-blue-600"
                >
                  invoice
                </button>
                </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
