import { useEffect, useState } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AccountDetails() {
  const [showForm, setShowForm] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    customer_no: "",
    company_name: "",
    account_no: "",
    ifsc: "",
    bank: "",
    branch: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const res = await axios.get("http://localhost:5000/api/account");
    setAccounts(res.data);
  };

  const fetchLatestCustomerFromAmc = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/account/latest-customer"
      );
      if (res.data?.customer_id) {
        setFormData((prev) => ({
          ...prev,
          customer_no: res.data.customer_id,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch latest AMC customer");
    }
  };

  /* ================= VALIDATION ================= */
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "company_name":
        if (!value.trim()) error = "Company name is required";
        else if (!/^[A-Za-z ]+$/.test(value)) error = "Company must contain only letters";
        break;

      case "account_no":
        if (!value.trim()) error = "Account number is required";
        else if (!/^\d+$/.test(value)) error = "Account number must contain only digits";
        else if (value.length !== 15) error = "Account number must be exactly 15 digits";
        break;

      case "ifsc":
        if (!value.trim()) error = "IFSC code is required";
        else if (!/^[0-9A-Za-z]+$/.test(value)) error = "IFSC must be alphanumeric";
        else if (value.length !== 11) error = "IFSC must be exactly 11 characters";
        break;

      case "bank":
        if (!value.trim()) error = "Bank is required";
        break;

      case "branch":
        if (!value.trim()) error = "Branch is required";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, maxLength } = e.target;

    let newValue = value;

    // Restrict Account Number to digits only
    if (name === "account_no") {
      newValue = newValue.replace(/\D/g, ""); // remove non-digit characters
    }

    // Restrict Company Name and IFSC to allowed chars
    if (name === "company_name") {
      newValue = newValue.replace(/[^A-Za-z ]/g, ""); // letters only
    }
    if (name === "ifsc") {
      newValue = newValue.replace(/[^0-9A-Za-z]/g, ""); // alphanumeric
    }

    // Enforce maxLength
    if (newValue.length > maxLength) newValue = newValue.slice(0, maxLength);

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    validateField(name, newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    if (Object.values(errors).some((err) => err)) {
      toast.error("Fix errors before submitting");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("profile", image);

    try {
      const res = await axios.post("http://localhost:5000/api/account", data);
      setAccounts((prev) => [res.data, ...prev]);

      toast.success("Account Details Added Successfully ");

      setFormData({
        customer_no: "",
        company_name: "",
        account_no: "",
        ifsc: "",
        bank: "",
        branch: "",
      });
      setImage(null);
      setErrors({});
      setShowForm(false);
    } catch (err) {
      toast.error("Submission failed ❌");
    }
  };

  const tableHeaders = [
    { label: "Customer No", color: "bg-blue-500" },
    { label: "QR", color: "bg-purple-500" },
    { label: "Company", color: "bg-green-500" },
    { label: "Account", color: "bg-orange-500" },
    { label: "Bank", color: "bg-pink-500" },
    { label: "Branch", color: "bg-indigo-500" },
  ];

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            fetchLatestCustomerFromAmc();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Account
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 mt-4 shadow rounded space-y-4"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <FiUpload />
            Upload QR Image
            <input
              type="file"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <input
            placeholder="CUSTOMER NO"
            className="border p-2 w-full"
            value={formData.customer_no}
            onChange={(e) =>
              setFormData({ ...formData, customer_no: e.target.value })
            }
          />

          {[
            { name: "company_name", max: 15 },
            { name: "account_no", max: 15 },
            { name: "ifsc", max: 11 },
            { name: "bank", max: 50 },
            { name: "branch", max: 50 },
          ].map((f) => (
            <div key={f.name}>
              <input
                placeholder={f.name.replace("_", " ").toUpperCase()}
                className={`border p-2 w-full ${errors[f.name] ? "border-red-500" : ""}`}
                name={f.name}
                maxLength={f.max}
                value={formData[f.name]}
                onChange={handleChange}
              />
              {errors[f.name] && <p className="text-red-500 text-sm">{errors[f.name]}</p>}
            </div>
          ))}

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      )}

      {!showForm && (
        <table className="w-full mt-6 border border-collapse">
          <thead>
            <tr>
              {tableHeaders.map((h) => (
                <th
                  key={h.label}
                  className={`${h.color} text-white border p-2 font-normal`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} className="text-center">
                <td className="border p-2 bg-gray-100">{a.customer_no}</td>
                <td className="border p-2 bg-gray-100">
                  {a.profile && (
                    <img
                      src={`http://localhost:5000/uploads/${a.profile}`}
                      className="w-24 mx-auto"
                      alt="QR"
                    />
                  )}
                </td>
                <td className="border p-2 bg-gray-100">{a.company_name}</td>
                <td className="border p-2 bg-gray-100">{a.account_no}</td>
                <td className="border p-2 bg-gray-100">{a.bank}</td>
                <td className="border p-2 bg-gray-100">{a.branch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
