import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "../styles/navigation.css";
import { Link } from "react-router-dom";
import NavLink from "./NavLink";
import { useState, useEffect } from "react";

interface AuthNavigationProps {
  mode?: "light" | "dark";
}

export default function AuthNavigation({ mode = "light" }: AuthNavigationProps) {
  const navigate = useNavigate();
  //const location = useLocation();
  //const isCategoriesPage = location.pathname === "/categories";
  //  const isProductsPage = location.pathname === "/products";
  const isAdmin = JSON.parse(localStorage.getItem("is_admin") || "false");
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((v) => !v);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`nav nav--${mode}`}>
        <div className="nav-left">
          <Link to="/" className="nav__logoWrap">
            <img className="nav__logo" src={"../public/images/logo/logo.png"} alt="Logo" />

          </Link>

        </div>
        <div className="nav-actions nav-actions--desktop">
          <NavLink to="/my-bids" label="Moje ponude" />
          <NavLink to="/active-auctions" label="Aukcije" />
          <NavLink to="/categories" label="Kategorije" />
          <NavLink to="/products" label="Proizvodi" />

        </div>
        <div className="nav-right nav-right--desktop">
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
        <button
          type="button"
          className="nav-hamburger"
          aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          onClick={toggleMenu}
        >
          <span className="nav-hamburger__bar" />
          <span className="nav-hamburger__bar" />
          <span className="nav-hamburger__bar" />
        </button>
      </nav>
      <div className={`nav-overlay ${menuOpen ? "is-open" : ""}`} onClick={closeMenu} />
      <aside
        id="mobile-nav-drawer"
        className={`nav-drawer nav-drawer--${mode} ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer__top">
          <div className="nav-drawer__title">Meni</div>
          <button type="button" className="nav-drawer__close" onClick={closeMenu} aria-label="Zatvori">
            ✕
          </button>
        </div>

        <div className="nav-drawer__links" onClick={closeMenu}>
          <NavLink to="/my-bids" label="Moje ponude" />
          <NavLink to="/active-auctions" label="Aukcije" />
          <NavLink to="/categories" label="Kategorije" />
          <NavLink to="/products" label="Proizvodi" />
          {isAdmin && <NavLink to="/admin/add" label="Dashboard" />}
        </div>

        <div className="nav-drawer__actions">
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
