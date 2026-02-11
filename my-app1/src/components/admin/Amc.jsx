import axios from "axios";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { FaFileExcel, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { generateAmcPdf } from "./AmcPdf";
import { useEffect, useState } from "react";

export default function Amc() {
  const [amcList, setAmcList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [dateError, setDateError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;


  // ACCOUNT DETAILS FOR PDF
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

  /* ==================== DATE VALIDATION ==================== */
  const validateDates = (start, end) => {
    if (!start || !end) return "Start date and End date are required";

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) return "End date must be greater than Start date";

    return "";
  };

  // HANDLE DATE CHANGE (CREATE & UPDATE) - error disappears automatically
  const handleDateChange = (field, value, source = "create") => {
    if (source === "create") {
      const updated = { ...formData, [field]: value };
      setFormData(updated);

      const error = validateDates(updated.start_date, updated.end_date);
      setDateError(error);
    } else {
      const updated = { ...updateData, [field]: value };
      setUpdateData(updated);

      const error = validateDates(updated.start_date, updated.end_date);
      setDateError(error);
    }
  };

  /* ==================== HELPERS ==================== */
  const toDateInput = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

  const numberToWords = (num) => {
    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

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
      if (n > 0) str += ones[n] + " ";
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

  /* ==================== API ==================== */
  const fetchAmc = async () => {
    const res = await axios.get("http://localhost:5000/api/amc");
    const sorted = res.data.sort(
      (a, b) => getDaysLeft(a.end_date) - getDaysLeft(b.end_date)
    );
    setAmcList(sorted);
  };

  const fetchAccountForPdf = async () => {
    const res = await axios.get("http://localhost:5000/api/account");
    if (res.data.length > 0) {
      const a = res.data[0];
      setAccount({
        company_name: a.company_name,
        account_no: a.account_no,
        ifsc: a.ifsc,
        bank: a.bank,
        branch: a.branch,
      });
    }
  };

  const fetchLatestCustomer = async () => {
    const res = await axios.get("http://localhost:5000/api/amc/latest-customer");
    fillCustomer(res.data);
  };

  const fetchCustomerById = async (id) => {
    if (!id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/amc/customer/${id}`);
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
      remaining_balance: Number(c.service_cost) - Number(c.advance_payment),
      status: autoStatus(c.service_cost, c.advance_payment),
    }));
  };

  const saveAmc = async () => {
    const error = validateDates(formData.start_date, formData.end_date);
    if (error) {
      setDateError(error);
      return;
    }
    setDateError("");

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

  const openUpdate = (row) => {
    setUpdateData({
      amc_id: row.amc_id,
      start_date: toDateInput(row.start_date),
      end_date: toDateInput(row.end_date),
    });
    setUpdateModal(true);
  };

  const updateAmcDates = async () => {
    const error = validateDates(updateData.start_date, updateData.end_date);
    if (error) {
      setDateError(error);
      return;
    }
    setDateError("");
    await axios.put(`http://localhost:5000/api/amc-actions/${updateData.amc_id}`, updateData);
    fetchAmc();
    setUpdateModal(false);
    alert("Dates updated");
  };

  const deleteAmc = async (amc_id) => {
    if (!window.confirm("Delete AMC?")) return;
    await axios.delete(`http://localhost:5000/api/amc-actions/${amc_id}`);
    fetchAmc();
  };

  useEffect(() => {
    fetchAmc();
    fetchAccountForPdf();
  }, []);
   /* ================= PAGINATION ================= */

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = amcList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(amcList.length / rowsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  /* ================= EXCEL EXPORT ================= */

  const exportToExcel = () => {
    const formattedData = amcList.map((a) => ({
      Name: a.name,
      Service: a.service_name,
      Cost: a.service_cost,
      Advance: a.advance_payment,
      Balance: a.remaining_balance,
      Status: a.status,
      Start_Date: new Date(a.start_date).toLocaleDateString(),
      End_Date: new Date(a.end_date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AMC Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
     const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "AMC_Data.xlsx");
  };

  /* ==================== UI ==================== */
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">AMC Management</h2>

      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            fetchLatestCustomer();
          }}
          className="bg-blue-600 text-white px-3 ml-270 py-2 rounded mb-4"
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
              onChange={(e) => handleDateChange("start_date", e.target.value, "create")}
            />
            <input
              type="date"
              className="border p-2"
              value={formData.end_date}
              onChange={(e) => handleDateChange("end_date", e.target.value, "create")}
            />
            {dateError && (
              <p className="text-red-600 text-sm col-span-2">{dateError}</p>
            )}
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
        <table className="w-full rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-normal  text-white border-b  bg-red-400">Name</th>
              <th className=" p-2 bg-yellow-400">Service</th>
              <th className=" p-2 bg-violet-300">Cost</th>
              <th className="p-2 bg-blue-300">Advance</th>
              <th className=" p-2 bg-indigo-300">Balance</th>
              <th className=" p-2 bg-green-300">Status</th>
              <th className=" p-2 bg-pink-300">Start</th>
              <th className=" p-2 bg-purple-300">End</th>
              <th className=" p-2 bg-gray-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {amcList.map((a) => (
              <tr key={a.amc_id} className={getRowColor(a.end_date)}>
                <td className="p-3 bg-yellow-200 border-b border-gray-300">{a.name}</td>
                <td className="p-3 bg-yellow-200 border-b border-gray-300">{a.service_name}</td>
                <td className="p-3 bg-yellow-200 border-b border-gray-300">₹{a.service_cost}</td>
                <td className="p-3 bg-yellow-200 border-b border-gray-300">₹{a.advance_payment}</td>
                <td className="p-3 bg-yellow-200 border-b border-gray-300">₹{a.remaining_balance}</td>
                <td className="p-3 bg-yellow-200 border-b border-gray-300">{a.status}</td>
                <td className="p-3 bg-yellow-200 border-b border-gray-300">{toDateInput(a.start_date)}</td>
                <td className="p-3 bg-yellow-200 border-b border-gray-300">{toDateInput(a.end_date)}</td>
                <td className="p-3 bg-yellow-200 border-b border-gray-300 flex gap-2 justify-center">
                  <button
                    onClick={() => openUpdate(a)}
                    className="bg-yellow-500 px-3 py-1 rounded"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => deleteAmc(a.amc_id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    <FiTrash2 size={18} />
                  </button>
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
                        profile: account.profile,
                      })
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <FiDownload size={18} />
                  </button>
                  <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  <FaFileExcel size={16} />
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
       {/* Pagination Section */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={prevPage}
          className="bg-gray-300 px-3 py-2 rounded"
        >
          <FaArrowLeft />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={nextPage}
          className="bg-gray-300 px-3 py-2 rounded"
        >
          <FaArrowRight />
        </button>
      </div>

      {updateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-4">Update Dates</h3>
            <input
              type="date"
              className="border p-2 w-full mb-3"
              value={updateData.start_date}
              onChange={(e) => handleDateChange("start_date", e.target.value, "update")}
            />
            <input
              type="date"
              className="border p-2 w-full mb-3"
              value={updateData.end_date}
              onChange={(e) => handleDateChange("end_date", e.target.value, "update")}
            />
            {dateError && (
              <p className="text-red-600 text-sm mb-3">{dateError}</p>
            )}
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
