import DashboardLayout from "../components/layout/DashboardLayout";

export default function Dashboard() {
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };
  }, []);

 
  return (<DashboardLayout />);
}
