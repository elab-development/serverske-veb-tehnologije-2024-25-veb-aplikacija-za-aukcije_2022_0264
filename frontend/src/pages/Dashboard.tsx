import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavigation from "../components/AuthNavigation";
import "../styles/adminadd.css";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import AddProductModal from "../components/modals/AddProductModal";
import AddAuctionModal from "../components/modals/AddAuctionModal";

const AdminAdd = () => {
  const navigate = useNavigate();
  const isAdmin = JSON.parse(localStorage.getItem("is_admin") || "false");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);

  // Ako nije admin, vrati ga
  if (!isAdmin) {
    navigate("/home", { replace: true });
    return null;
  }

  return (
    <>
      <AuthNavigation />
      <div className="admin-add-container">
        <h1 className="admin-add-title">Administracija</h1>
        <p className="admin-add-subtitle">Odaberite šta želite da dodate</p>

        <div className="admin-add-buttons">
          <button
            className="admin-add-btn"
            onClick={() => setShowCategoryModal(true)}
          >
            <span className="btn-icon">📂</span>
            <span className="btn-text">Dodaj kategoriju</span>
          </button>

          <button
            className="admin-add-btn"
            onClick={() => setShowProductModal(true)}
          >
            <span className="btn-icon">📦</span>
            <span className="btn-text">Dodaj proizvod</span>
          </button>

          <button
            className="admin-add-btn"
            onClick={() => setShowAuctionModal(true)}
          >
            <span className="btn-icon">🔨</span>
            <span className="btn-text">Dodaj aukciju</span>
          </button>
        </div>

        {/* Modali */}
        {showCategoryModal && (
          <AddCategoryModal onClose={() => setShowCategoryModal(false)} />
        )}
        {showProductModal && (
          <AddProductModal onClose={() => setShowProductModal(false)} />
        )}
        {showAuctionModal && (
          <AddAuctionModal onClose={() => setShowAuctionModal(false)} />
        )}
      </div>
    </>
  );
};

export default AdminAdd;
