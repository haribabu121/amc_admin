import { useState } from "react";
import { FiUsers, FiChevronDown } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiUserPlus } from "react-icons/fi";
import { MdOutlineSettingsAccessibility } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { BiPowerOff } from "react-icons/bi";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeView,
  setActiveView,
}) {
  const [staffOpen, setStaffOpen] = useState(false);
  const [amcOpen, setAmcOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [customerServiceOpen, setCustomerServiceOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside
      className={`relative fixed z-50 inset-y-0 left-0 w-70 h-full bg-[#191C24] text-gray-200
      transform transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 overflow-hidden`}
    >
      {/* ================= VIDEO BACKGROUND ================= */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/dashboard-bg.mp4" type="video/mp4" />
      </video>

      {/* ================= DARK OVERLAY (NO LAYOUT IMPACT) ================= */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 h-full">
        {/* BRAND */}
        <div className="px-6 py-5 border-b border-gray-100 text-blue-500 text-xl font-bold">
          Admin Panel
        </div>

        {/* MENU */}
        <nav className="px-2 space-y-1 mt-4">
          <MenuButton
            icon={<MdDashboard />}
            label="Dashboard"
            active={activeView === "dashboard"}
            onClick={() => {
              setActiveView("dashboard");
              setSidebarOpen(false);
            }}
          />

          <MenuDropdown
            title="Staff / Users"
            icon={<FiUsers />}
            open={staffOpen}
            toggle={() => setStaffOpen(!staffOpen)}
          >
            <MenuItem
              label="Create Staff"
              active={activeView === "create-staff"}
              onClick={() => {
                setActiveView("create-staff");
                setSidebarOpen(false);
              }}
            />
          </MenuDropdown>

          <MenuDropdown
            title="AMC"
            icon={<AiOutlinePlusCircle />}
            open={amcOpen}
            toggle={() => setAmcOpen(!amcOpen)}
          >
            <MenuItem
              label="Create AMC"
              active={activeView === "create-amc"}
              onClick={() => {
                setActiveView("create-amc");
                setSidebarOpen(false);
              }}
            />
          </MenuDropdown>

          <MenuDropdown
            title="Service"
            icon={<MdOutlineSettingsAccessibility />}
            open={serviceOpen}
            toggle={() => setServiceOpen(!serviceOpen)}
          >
            <MenuItem
              label="Create Service"
              active={activeView === "create-service"}
              onClick={() => {
                setActiveView("create-service");
                setSidebarOpen(false);
              }}
            />
          </MenuDropdown>

          <MenuDropdown
            title="Customer Service"
            icon={<FiUserPlus />}
            open={customerServiceOpen}
            toggle={() => setCustomerServiceOpen(!customerServiceOpen)}
          >
            <MenuItem
              label="Create Customer Service"
              active={activeView === "create-customer-service"}
              onClick={() => {
                setActiveView("create-customer-service");
                setSidebarOpen(false);
              }}
            />
          </MenuDropdown>

          <MenuDropdown
            title="Settings"
            icon={<CiSettings />}
            open={settingsOpen}
            toggle={() => setSettingsOpen(!settingsOpen)}
          >
            <MenuItem
              label="Profile"
              active={activeView === "account-details"}
              onClick={() => {
                setActiveView("account-details");
                setSidebarOpen(false);
              }}
            />
          </MenuDropdown>
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-6 w-full flex justify-center">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white"
          >
            <BiPowerOff size={22} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ===== REUSABLE ===== */

function MenuButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded
      ${active ? "bg-blue-600 text-white" : "hover:bg-gray-700"}`}
    >
      {icon} {label}
    </button>
  );
}

function MenuDropdown({ title, icon, open, toggle, children }) {
  return (
    <>
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700 rounded"
      >
        <span className="flex items-center gap-3">
          {icon} {title}
        </span>
        <FiChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="ml-6">{children}</div>}
    </>
  );
}

function MenuItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded text-sm
      ${active ? "bg-blue-600 text-white" : "hover:bg-gray-700"}`}
    >
      • {label}
    </button>
  );
}
