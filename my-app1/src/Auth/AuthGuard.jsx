import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function AuthGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = Cookies.get("auth");

    // Push current state to block back
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      if (auth) {
        navigate("/dashboard", { replace: true });
      }
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  return children;
}
