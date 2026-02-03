import { FiHome, FiUsers, FiChevronDown } from "react-icons/fi";
import { BiPowerOff } from "react-icons/bi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { HiOutlineWrench } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";
import { MdOutlineSettingsAccessibility } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { useState } from "react";

export default function Sidebar({ setActiveView, activeView }) {
  const [staffOpen, setStaffOpen] = useState(false);
  const [amcOpen, setAmcOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [customerServiceOpen, setCustomerServiceOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);


  return (
    <aside className="w-64 bg-white shadow h-screen fixed">
      <div className=" min-h-screen text-white">

      {/* Header */}
      <div className="text-black p-4 font-bold border-b">ADMIN PANEL</div>

      {/* Dashboard */}
      <button
        onClick={() => setActiveView("dashboard")}
        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
          activeView === "dashboard"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600"
        }`}
      >
        <MdDashboard className="inline mr-2" />
        Dashboard
      </button>

      {/* STAFF DROPDOWN */}
      <button
        onClick={() => setStaffOpen(!staffOpen)}
        className="w-full px-4 py-2 flex justify-between hover:bg-gray-100 text-gray-600"
      >
        <span>
          <FiUsers className="inline mr-2" />
          Staff / Users
        </span>
        <FiChevronDown
          className={`transition-transform ${
            staffOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {staffOpen && (
        <div className="ml-6 mt-1 space-y-1">
          <button
            onClick={() => setActiveView("create-staff")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeView === "create-staff"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            • Create Staff
          </button>
        </div>
      )}

      {/* AMC DROPDOWN */}
      <button
        onClick={() => setAmcOpen(!amcOpen)}
        className="w-full px-4 py-2 flex justify-between hover:bg-gray-100 text-gray-600"
      >
        <span>
          <AiOutlinePlusCircle className="inline mr-2" />
          AMC
        </span>
        <FiChevronDown
          className={`transition-transform ${
            amcOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {amcOpen && (
        <div className="ml-6 mt-1 space-y-1">
          <button
            onClick={() => setActiveView("create-amc")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeView === "create-amc"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            • Create AMC
          </button>
        </div>
      )}

      {/* SERVICE (ADMIN) */}
      <button
        onClick={() => setServiceOpen(!serviceOpen)}
        className="w-full px-4 py-2 flex justify-between hover:bg-gray-100 text-gray-600"
      >
        <span>
          <MdOutlineSettingsAccessibility className="inline mr-2" />
          Service
        </span>
        <FiChevronDown
          className={`transition-transform ${
            serviceOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {serviceOpen && (
        <div className="ml-6 mt-1 space-y-1">
          <button
            onClick={() => setActiveView("create-service")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeView === "create-service"
                ? "hover text-red-700"
                : "hover:text-red-600"
            }`}
          >
            • Create Service
          </button>
        </div>
      )}

      {/* CUSTOMER SERVICE */}
      <button
        onClick={() =>
          setCustomerServiceOpen(!customerServiceOpen)
        }
        className="w-full px-4 py-2 flex justify-between hover:bg-gray-100 text-gray-600"
      >
        <span>
          <FiUserPlus className="inline mr-2" />
          Customer Service
        </span>
        <FiChevronDown
          className={`transition-transform ${
            customerServiceOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {customerServiceOpen && (
        <div className="ml-6 mt-1 space-y-1">
          <button
            onClick={() =>
              setActiveView("create-customer-service")
            }
            className={`block w-full text-left px-4 py-2 rounded ${
              activeView === "create-customer-service"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            • Create Customer Service
          </button>
        </div>
      )}
      {/* ACCOUNT DETAILS */}
<button
  onClick={() => setAccountOpen(!accountOpen)}
  className="w-full px-4 py-2 flex justify-between hover:bg-gray-100 text-gray-600"
>
  <span>
    <CiSettings className="inline mr-2 h-9 w-5" />
    Settings
  </span>
  <FiChevronDown
    className={`transition-transform ${accountOpen ? "rotate-180" : ""}`}
  />
</button>

{accountOpen && (
  <div className="ml-6 mt-1 space-y-1">
    <button
      onClick={() => setActiveView("account-details")}
      className={`block w-full text-left px-4 py-2 rounded ${
        activeView === "account-details"
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      • Profile
    </button>
  </div>
)}

      {/* LOGOUT BUTTON */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 ml-2">
  <button
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }}
    className="w-12 h-12 rounded-full bg-red-600 text-white flex justify-center items-center shadow"
  >
    <BiPowerOff className="text-2xl" />
  </button>

      </div>
      </div>
    </aside>
  );
}
