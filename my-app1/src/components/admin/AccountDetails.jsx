import { useEffect, useState } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

export default function AccountDetails() {
  const [showForm, setShowForm] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    customer_no:"",
    company_name: "",
    account_no: "",
    ifsc: "",
    bank: "",
    branch: "",
  });

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
        customer_no: res.data.customer_id, //  AMC → Account
      }));
    }
  } catch (err) {
    console.error("Failed to fetch latest AMC customer");
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) =>
      data.append(k, v)
    );
    if (image) data.append("profile", image);

    await axios.post("http://localhost:5000/api/account", data);

    alert("Account Details Submitted Successfully ✅");
    setShowForm(false);
    setFormData({
      customer_no:"",
      company_name: "",
      account_no: "",
      ifsc: "",
      bank: "",
      branch: "",
    });
    setImage(null);
    fetchAccounts();
  };

  return (
    <div className="p-6">
      <button
  onClick={() => {
    setShowForm(true);
    fetchLatestCustomerFromAmc(); // autofill from AMC
  }}
  className="bg-blue-600 text-white px-4 py-2 ml-260 rounded"
>
  + Add Account
</button>


      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 mt-4 shadow rounded space-y-4"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <FiUpload />
            Upload Profile Image
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

          {["company_name","account_no","ifsc","bank","branch"].map((f) => (
            <input
              key={f}
              placeholder={f.replace("_", " ").toUpperCase()}
              className="border p-2 w-full"
              value={formData[f]}
              onChange={(e) =>
                setFormData({ ...formData, [f]: e.target.value })
              }
            />
          ))}

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      )}

      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Customer_no</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Account</th>
            <th className="border p-2">Bank</th>
            <th className="border p-2">Branch</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id}>
              <td className="border p-2">{a.customer_no}</td>
              <td className=" border p-2">
                {a.profile && (
                  <img
                    src={`http://localhost:5000/uploads/${a.profile}`}
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </td>
              <td className="border p-2">{a.company_name}</td>
              <td className="border p-2">{a.account_no}</td>
              <td className="border p-2">{a.bank}</td>
              <td className="border p-2">{a.branch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
