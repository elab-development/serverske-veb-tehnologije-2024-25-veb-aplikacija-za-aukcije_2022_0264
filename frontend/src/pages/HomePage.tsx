import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavigation from "../components/AuthNavigation";
import "../styles/homepage.css";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <AuthNavigation />
      <div className="hero">
        <h1 className="h1-hp">Dobrodošli 🎉</h1>
        <p className="p-24">Uspešno ste se ulogovali u aplikaciju za online aukcije.</p>
      </div>
    </>
  );
};

export default HomePage;


