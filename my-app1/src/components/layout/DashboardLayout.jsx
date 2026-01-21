import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import CreateStaff from "../admin/CreateStaff";
import ManageStaff from "../admin/ManageStaff";
import Amc from "../admin/Amc"; // ✅ IMPORT AMC
import Service from "../services/Service"; // ✅ IMPORT SERVICE

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  const renderPage = () => {
    switch (activeView) {
      case "create-staff":
        return <CreateStaff />;

      case "create-amc":
        return <Amc />; // ✅ AMC PAGE RENDERS HERE
      case "create-service":
        return <Service />; // ✅ SERVICE PAGE RENDERS HERE

      
      default:
        return (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <ManageStaff />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <div className={`flex-1 ${sidebarOpen ? "ml-64" : ""}`}>
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-6 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
