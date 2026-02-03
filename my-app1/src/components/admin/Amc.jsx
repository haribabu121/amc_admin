import axios from "axios";
import { generateAmcPdf } from "./AmcPdf";
import { useEffect, useState } from "react";

export default function Amc() {
  const [amcList, setAmcList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
//  ACCOUNT DETAILS FOR PDF
  const [account, setAccount] = useState({
    company_name: "",
    account_no: "",
    ifsc: "",
    bank: "",
    branch: "",
  });
  const [formData, setFormData] = useState({
    customer_id: "",
    name: "",
    service_name: "",
    service_cost: "",
    advance_payment: "",
    remaining_balance: 0,
    status: "Unpaid",
    start_date: "",
    end_date: "",
  });

  const [updateData, setUpdateData] = useState({
    amc_id: "",
    start_date: "",
    end_date: "",
  });


const numberToWords = (num) => {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  if (num === 0) return "Zero";

  const convertBelowThousand = (n) => {
    let str = "";

    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    if (n > 0) {
      str += ones[n] + " ";
    }

    return str.trim();
  };

  let result = "";

  if (num >= 1000) {
    result += convertBelowThousand(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }

  result += convertBelowThousand(num);

  return result.trim();
};



  /* ================= HELPERS ================= */

  const toDateInput = (d) =>
    d ? new Date(d).toISOString().split("T")[0] : "";


  // ✅ FETCH ACCOUNT DETAILS (ENTERED VALUES)
  const fetchAccountForPdf = async () => {
    const res = await axios.get("http://localhost:5000/api/account");
    if (res.data.length > 0) {
      const a = res.data[0]; // latest
      setAccount({
        company_name: a.company_name,
        account_no: a.account_no,
        ifsc: a.ifsc,
        bank: a.bank,
        branch: a.branch,
      });
    }
  };

  const autoStatus = (cost, adv) => {
    cost = Number(cost || 0);
    adv = Number(adv || 0);
    if (adv === 0) return "Unpaid";
    if (adv >= cost) return "Paid";
    return "Pending";
  };

  const getDaysLeft = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  };

  const getRowColor = (endDate) => {
    const days = getDaysLeft(endDate);
    if (days <= 0) return "bg-red-400 text-white";
    if (days <= 15) return "bg-yellow-200";
    return "bg-green-100";
  };

  /* ================= API ================= */

  const fetchAmc = async () => {
    const res = await axios.get("http://localhost:5000/api/amc");
    const sorted = res.data.sort(
      (a, b) => getDaysLeft(a.end_date) - getDaysLeft(b.end_date)
    );
    setAmcList(sorted);
  };

  const fetchLatestCustomer = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/amc/latest-customer"
    );
    fillCustomer(res.data);
  };

  const fetchCustomerById = async (id) => {
    if (!id) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/amc/customer/${id}`
      );
      fillCustomer(res.data);
    } catch {
      alert("Customer not found");
    }
  };

  const fillCustomer = (c) => {
    if (!c) return;
    setFormData((prev) => ({
      ...prev,
      customer_id: c.customer_id,
      name: c.name,
      service_name: c.service_name,
      service_cost: c.service_cost,
      advance_payment: c.advance_payment,
      remaining_balance:
        Number(c.service_cost) - Number(c.advance_payment),
      status: autoStatus(c.service_cost, c.advance_payment),
    }));
  };
  const saveAmc = async () => {
    await axios.post("http://localhost:5000/api/amc", {
      ...formData,
      service_cost: Number(formData.service_cost),
      advance_payment: Number(formData.advance_payment),
      remaining_balance: Number(formData.remaining_balance),
    });

    fetchAmc();
    setShowForm(false);
    alert("AMC saved successfully");
  };

  /* ================= UPDATE ================= */

  const openUpdate = (row) => {
    setUpdateData({
      amc_id: row.amc_id,
      start_date: toDateInput(row.start_date),
      end_date: toDateInput(row.end_date),
    });
    setUpdateModal(true);
  };

  const updateAmcDates = async () => {
    await axios.put(
      `http://localhost:5000/api/amc-actions/${updateData.amc_id}`,
      updateData
    );
    fetchAmc();
    setUpdateModal(false);
    alert("dates updated")
  };

 /* ================= PDF ================= */

  const downloadPdf = async (amc_id) => {
    const res = await axios.get(
      `http://localhost:5000/api/amc-actions/pdf/${amc_id}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `amc_${amc_id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };
  useEffect(() => {
    fetchAmc();
     fetchAccountForPdf();
  }, []);

  // DELETE STAFF
  const deleteAmc = async (amc_id) => {
    if (!window.confirm("Delete staff?")) return;
    await axios.delete(`http://localhost:5000/api/amc-actions/${amc_id}`);
    fetchAmc();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">AMC Management</h2>

      {!showForm && (
        <button
          onClick={() => {setShowForm(true);
             fetchLatestCustomer();}}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Add AMC
        </button>
      )}

      {showForm && (
        <div className="bg-white p-4 shadow rounded mb-6">
          <div className="grid grid-cols-2 gap-3">
             <input
              className="border p-2"
              placeholder="Customer ID"
              value={formData.customer_id}
              onChange={(e) =>
                setFormData({ ...formData, customer_id: e.target.value })
              }
              onBlur={(e) => fetchCustomerById(e.target.value)}
            />

            <input className="border p-2" value={formData.name} disabled />
            <input className="border p-2" value={formData.service_name} disabled />
            <input className="border p-2" value={formData.service_cost} disabled />
            <input className="border p-2" value={formData.advance_payment} disabled />

            <input
              className="border p-2 bg-gray-100"
              value={formData.remaining_balance}
              disabled
            />

            <input
              type="date"
              className="border p-2"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
            />

            <input
              type="date"
              className="border p-2"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
            />

            <input
              className="border p-2 bg-gray-100"
              value={formData.status}
              disabled
            />
          </div>

          <button
            onClick={saveAmc}
            className="bg-green-600 text-white px-6 py-2 rounded mt-4"
          >
            Save
          </button>
        </div>
      )}

      {!showForm && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
               <th className="border p-2">Name</th>
              <th className="border p-2">Service</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Advance</th>
              <th className="border p-2">Balance</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">End</th>
              <th className="border p-2">Action</th>

            </tr>
          </thead>
          <tbody>
            {amcList.map((a) => (
              <tr key={a.amc_id} className={getRowColor(a.end_date)}>
                <td className="border p-2">{a.name}</td>
                <td className="border p-2">{a.service_name}</td>
                <td className="border p-2">₹{a.service_cost}</td>
                <td className="border p-2">₹{a.advance_payment}</td>
                <td className="border p-2">₹{a.remaining_balance}</td>
                <td className="border p-2">{a.status}</td>
                <td className="border p-2">{toDateInput(a.start_date)}</td>

                 <td className="border p-2">{toDateInput(a.end_date)}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => openUpdate(a)}
                    className="bg-yellow-500 px-3 py-1 rounded"
                  >
                    Update
                  </button>
                   <button onClick={() => deleteAmc(a.amc_id)}
                    className="bg-red-600 px-3 py-1 rounded"
                    >
                    delete
                    </button>
                  {/* <button
                    onClick={() => downloadPdf(a.amc_id)}
                    className="bg-blue-600 px-3 py-1 rounded text-white"
                  >
                    PDF
                  </button> */}
                  <button
  onClick={() =>
    generateAmcPdf({
      customer_id: a.customer_id,
      customer_name: a.name,
      customer_address: a.address || "Hyderabad, Telangana",
      service_cost: a.service_cost,
      amount_words: `${numberToWords(a.service_cost)} Indian Rupees Only`,
      start_date: a.start_date,
      end_date: a.end_date,
      due_date: a.end_date,
      company_name: account.company_name,
                      account_no: account.account_no,
                      ifsc: account.ifsc,
                      bank: account.bank,
                      branch: account.branch,
                      profile: account.profile
    })
  }
  className="bg-blue-600 text-white px-3 py-1 rounded"
>
  PDF
</button>
                </td>
                

              </tr>
            ))}
          </tbody>
        </table>
      )}
      {updateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-4">Update Dates</h3>
            <input
              type="date"
              className="border p-2 w-full mb-3"
              value={updateData.start_date}
              onChange={(e) =>
                setUpdateData({ ...updateData, start_date: e.target.value })
              }
            />
            <input
              type="date"
              className="border p-2 w-full mb-3"
              value={updateData.end_date}
              onChange={(e) =>
                setUpdateData({ ...updateData, end_date: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUpdateModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateAmcDates}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
