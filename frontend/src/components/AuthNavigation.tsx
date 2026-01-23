import { useNavigate} from "react-router-dom";
import Button from "./Button";
import "../styles/navigation.css";
import { Link } from "react-router-dom";
import NavLink from "./NavLink";

interface AuthNavigationProps {
  mode?: "light" | "dark";
}

export default function AuthNavigation({ mode = "light" }: AuthNavigationProps) {
  const navigate = useNavigate();
  //const location = useLocation();
  //const isCategoriesPage = location.pathname === "/categories";
  //  const isProductsPage = location.pathname === "/products";
  const isAdmin = JSON.parse(localStorage.getItem("is_admin") || "false");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className={`nav nav--${mode}`}>
      <div className="nav-left">
        <Link to="/" className="nav__logoWrap">
          <img className="nav__logo" src={"../public/images/logo/logo.png"} alt="Logo" />
       
        </Link>
        
      </div>
      <div className="nav-actions">
        <NavLink to="/my-bids" label="Moje ponude" />
        <NavLink to="/active-auctions" label="Aukcije" />
        <NavLink to="/categories" label="Kategorije" />
        <NavLink to="/products" label="Proizvodi" />
        
      </div>
      <div className="nav-right"> 
        {isAdmin && (
          
          <NavLink to="/admin/add" label="Dashboard" />
        )}
        <Button
          variant="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
