import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthNavigation from "../components/AuthNavigation";
import "../styles/dashboard.css";
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

  // State za podatke
  const [auctions, setAuctions] = useState<any[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<any|null>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [allBids, setAllBids] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState("");
    // Funkcija za otvaranje modala i učitavanje bidova
    const handleAuctionClick = (auction:any) => {
      setSelectedAuction(auction);
      setModalOpen(true);
      setBidsLoading(true);
      setBidsError("");
      api.get(`/auctions/${auction.id}/bids`)
        .then((res) => {
          setBids(Array.isArray(res.data) ? res.data : res.data?.bids || res.data?.data || []);
        })
        .catch(() => setBidsError("Greška pri učitavanju bidova."))
        .finally(() => setBidsLoading(false));
    };
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState<{type:'product'|'category',item:any}|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/auctions"),
      api.get("/categories"),
      api.get("/products"),
      api.get("/bids"),
    ])
      .then(([a, c, p, b]) => {
        setAuctions(Array.isArray(a.data) ? a.data : a.data?.data || a.data?.auctions || []);
        setCategories(Array.isArray(c.data) ? c.data : c.data?.categories || c.data?.data || []);
        setProducts(Array.isArray(p.data) ? p.data : p.data?.data || []);
        setAllBids(Array.isArray(b.data) ? b.data : b.data?.bids || b.data?.data || []);
      })
      .catch(() => setError("Greška pri učitavanju podataka."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AuthNavigation mode="dark"/>
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

      {/* Novi wrapper za 3 bloka */}
      <div className="admin-lists-wrapper">
        <div className="admin-list-block">
          <h2>Aukcije</h2>
          {loading ? <p>Učitavanje...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
            <ul className="admin-list">
              {auctions.map((a:any) => (
                <li key={a.id} className="admin-list-clickable" onClick={() => handleAuctionClick(a)} style={{cursor:'pointer'}}>
                  {a.title || a.name}
                </li>
              ))}
                  {/* Modal za bidove */}
                  <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <div style={{background:'#fff', borderRadius:10, padding:20, color:'#3B0270'}}>
                      <h3 style={{marginTop:0, marginBottom:16, color:'#7c3aed'}}>Bidovi za aukciju: {selectedAuction?.title || selectedAuction?.name}</h3>
                      {bidsLoading ? (
                        <p>Učitavanje...</p>
                      ) : bidsError ? (
                        <p style={{color:'red'}}>{bidsError}</p>
                      ) : bids.length === 0 ? (
                        <p>Nema bidova za ovu aukciju.</p>
                      ) : (
                        <ul style={{listStyle:'none',padding:0}}>
                          {bids.map((bid:any) => (
                            <li key={bid.id} style={{borderBottom:'1px solid #eee',padding:'8px 0'}}>
                              <strong>Korisnik:</strong> {bid.user?.name || bid.user_id || 'Nepoznato'}<br/>
                              <strong>Iznos:</strong> {bid.amount}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div style={{display:'flex',gap:12,marginTop:18}}>
                        <button style={{background:'#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={()=>setModalOpen(false)}>Zatvori</button>
                        <button style={{background:'#b30000',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={async()=>{
                          if(selectedAuction){
                            if(window.confirm('Da li ste sigurni da želite da obrišete ovu aukciju?')){
                              try{
                                await api.delete(`/auctions/${selectedAuction.id}`);
                                setAuctions((prev)=>prev.filter((a:any)=>a.id!==selectedAuction.id));
                                setModalOpen(false);
                              }catch{
                                alert('Greška pri brisanju aukcije.');
                              }
                            }
                          }
                        }}>Obriši aukciju</button>
                      </div>
                    </div>
                  </Modal>
            </ul>
          )}
        </div>
        <div className="admin-list-block">
          <h2>Proizvodi</h2>
          {loading ? <p>Učitavanje...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
            <ul className="admin-list">
              {products.map((p:any) => (
                <li key={p.id} className="admin-list-clickable" style={{cursor:'pointer'}} onClick={()=>setDeleteModal({type:'product',item:p})}>
                  {p.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="admin-list-block">
          <h2>Kategorije</h2>
          {loading ? <p>Učitavanje...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
            <ul className="admin-list">
              {categories.map((c:any) => (
                <li key={c.id} className="admin-list-clickable" style={{cursor:'pointer'}} onClick={()=>setDeleteModal({type:'category',item:c})}>
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
            {/* Modal za potvrdu brisanja proizvoda/kategorije */}
            {deleteModal && (
              <Modal open={true} onClose={()=>setDeleteModal(null)}>
                <div style={{background:'#fff', borderRadius:10, padding:20, color:'#3B0270', minWidth:260}}>
                  <h3 style={{marginTop:0, marginBottom:16, color:'#7c3aed'}}>Da li želite da izbrisete {deleteModal.type === 'product' ? 'proizvod' : 'kategoriju'}?</h3>
                  <p style={{marginBottom:18}}><strong>{deleteModal.item.name}</strong></p>
                  <div style={{display:'flex',gap:12}}>
                    <button style={{background:'#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={()=>setDeleteModal(null)}>Otkaži</button>
                    <button style={{background:'#b30000',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={async()=>{
                      try{
                        if(deleteModal.type==='product'){
                          await api.delete(`/products/${deleteModal.item.id}`);
                          setProducts((prev)=>prev.filter((p:any)=>p.id!==deleteModal.item.id));
                        }else{
                          await api.delete(`/categories/${deleteModal.item.id}`);
                          setCategories((prev)=>prev.filter((c:any)=>c.id!==deleteModal.item.id));
                        }
                        setDeleteModal(null);
                      }catch{
                        alert('Greška pri brisanju.');
                      }
                    }}>Izbriši</button>
                  </div>
                </div>
              </Modal>
            )}
      </div>
      {/* Blok za sve bidove */}
      <div className="admin-bids-block">
        <h2>Svi bidovi</h2>
        {loading ? <p>Učitavanje...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
          <ul className="admin-bids-list">
            {allBids.map((bid:any) => (
              <li key={bid.id}>
                <strong>Aukcija:</strong> {bid.auction?.title || bid.auction_id || 'Nepoznato'}<br/>
                <strong>Korisnik:</strong> {bid.user?.name || bid.user_id || 'Nepoznato'}<br/>
                <strong>Iznos:</strong> {bid.amount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AdminAdd;
