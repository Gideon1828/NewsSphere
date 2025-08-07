import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const isNewUser = query.get("isNewUser") === "true"; // read from query string

    if (token) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", token);

      // Redirect based on whether it's a new user
      if (isNewUser) {
        navigate("/Categories");
      } else {
        navigate("/Aftersignup");
      }
    } else {
      alert("Google login failed");
      navigate("/Login");
    }
  }, [location, navigate]);

  return <div>Signing you in with Google...</div>;
}
