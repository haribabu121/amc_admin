import {
  FiHome,
  FiUsers,
  FiChevronDown,
} from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { HiOutlineWrench } from "react-icons/hi2";
import { useState } from "react";

export default function Sidebar({ setActiveView, activeView }) {
  const [staffOpen, setStaffOpen] = useState(false);
  const [amcOpen, setAmcOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  return (
    <aside className="w-64 bg-white shadow h-screen fixed">
      {/* Header */}
      <div className="p-4 font-bold border-b">ADMIN PANEL</div>

      {/* Dashboard */}
      <button
        onClick={() => setActiveView("dashboard")}
        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
          activeView === "dashboard"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600"
        }`}
      >
        <FiHome className="inline mr-2" />
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

      {/* SERVICE DROPDOWN */}
      <button
        onClick={() => setServiceOpen(!serviceOpen)}
        className="w-full px-4 py-2 flex justify-between hover:bg-gray-100 text-gray-600"
      >
        <span>
          <HiOutlineWrench className="inline mr-2" />
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
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            • Create Service
          </button>
        </div>
      )}
    </aside>
  );
}
