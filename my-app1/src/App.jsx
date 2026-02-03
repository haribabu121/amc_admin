import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import ManageStaff from "./components/admin/ManageStaff";
import Amc from "./components/admin/Amc";
import Service from "./components/services/Service";
import Invoice from "./components/admin/Invoice";
// import AuthGuard from "./Auth/AuthGuard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard" element={
                <DashboardLayout />}/>
        <Route path="/manage-staff" element={<ManageStaff />} />
        <Route path="/amc" element={<Amc />} />
        <Route path="/service" element={<Service />} />
        <Route path="/invoice" element={<Invoice/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
