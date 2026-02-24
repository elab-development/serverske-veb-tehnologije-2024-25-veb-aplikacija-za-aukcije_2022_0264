import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import "../styles/navigation.css";
export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const isCategoriesPage = location.pathname === "/categories";
  const isProductsPage = location.pathname === "/products";
  return (
    <nav className="nav">


      <div className="nav-actions">
       
        {!isLoggedIn && !isCategoriesPage && (
          <Button
            variant="secondary"
            onClick={() => navigate("/categories")}
          >
            Kategorije
          </Button>
        )}
        {!isLoggedIn && !isProductsPage && (
          <Button
            variant="secondary"
            onClick={() => navigate("/products")}
          >
            Proizvodi
          </Button>
        )}
        {(isCategoriesPage || isProductsPage) && !isLoggedIn && (
          <Button
            variant="secondary"
            onClick={()=> navigate("/login")}
            >
              Nazad na login
            </Button>

        )}

      </div>
    </nav>
  );
}
