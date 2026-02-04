import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import CreateStaff from "../admin/CreateStaff";
import Amc from "../admin/Amc";
import Service from "../services/Service";
import Customer from "../customer/Customer";
import AccountDetails from "../admin/AccountDetails";
import DashboardBarChart from "../admin/DashboardBarChart";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  const renderPage = () => {
    switch (activeView) {
      case "create-staff":
        return <CreateStaff />;
      case "create-amc":
        return <Amc />;
      case "create-service":
        return <Service />;
      case "create-customer-service":
        return <Customer />;
      case "account-details":
        return <AccountDetails />;
      default:
        return <DashboardBarChart />;
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-100">

      {/* ========== BUBBLE BACKGROUND ========== */}
      <div className="absolute inset-0 pointer-events-none z-0">

        {/* Bottom bubbles */}
        <span className="bubble bubble-bottom left-[10%] w-10 h-10 animate-[bubble-up_14s_linear_infinite]" />
        <span className="bubble bubble-bottom left-[30%] w-16 h-16 animate-[bubble-up_20s_linear_infinite]" />

        {/* Top bubbles */}
        <span className="bubble bubble-top left-[50%] w-12 h-12 animate-[bubble-down_18s_linear_infinite]" />
        <span className="bubble bubble-top left-[70%] w-8 h-8 animate-[bubble-down_14s_linear_infinite]" />

        {/* Left bubbles */}
        <span className="bubble bubble-left top-[30%] w-14 h-14 animate-[bubble-right_22s_linear_infinite]" />
        <span className="bubble bubble-left top-[60%] w-10 h-10 animate-[bubble-right_16s_linear_infinite]" />

        {/* Right bubbles */}
        <span className="bubble bubble-right top-[40%] w-16 h-16 animate-[bubble-left_24s_linear_infinite]" />
        <span className="bubble bubble-right top-[70%] w-8 h-8 animate-[bubble-left_18s_linear_infinite]" />
      </div>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onProfile={() => setActiveView("account-details")}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
