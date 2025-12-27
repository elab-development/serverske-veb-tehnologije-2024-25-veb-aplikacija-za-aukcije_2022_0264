import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";
const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="hero">
      <h1 className="h1-hp">Dobrodošli 🎉</h1>
      <p className="p-24">Uspešno ste se ulogovali u aplikaciju za online aukcije.</p>

      <button className="dugmePocetna" onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;


