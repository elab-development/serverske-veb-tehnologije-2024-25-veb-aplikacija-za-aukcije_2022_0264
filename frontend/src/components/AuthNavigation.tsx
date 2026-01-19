import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import "../styles/navigation.css";

export default function AuthNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCategoriesPage = location.pathname === "/categories";
  const isProductsPage = location.pathname === "/products";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="nav">
      <div className="nav-actions">
        <Button
          variant="secondary"
          onClick={() => navigate("/categories")}
        >
          Kategorije
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate("/products")}
        >
          Proizvodi
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate("/my-bids")}
        >
          Moje ponude
        </Button>

        {(isCategoriesPage || isProductsPage) && (
          <Button
            variant="secondary"
            onClick={() => navigate("/home")}
          >
            Nazad na početnu
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
