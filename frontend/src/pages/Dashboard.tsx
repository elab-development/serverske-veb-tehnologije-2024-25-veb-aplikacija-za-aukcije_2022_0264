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
  const [editAuctionModalOpen, setEditAuctionModalOpen] = useState(false);
  const [editAuctionDesc, setEditAuctionDesc] = useState("");
  const [editAuctionEnd, setEditAuctionEnd] = useState("");
  const [editAuctionLoading, setEditAuctionLoading] = useState(false);
  const [editAuctionError, setEditAuctionError] = useState("");

  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [editProductName, setEditProductName] = useState("");
  const [editProductLoading, setEditProductLoading] = useState(false);
  const [editProductError, setEditProductError] = useState("");

  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryLoading, setEditCategoryLoading] = useState(false);
  const [editCategoryError, setEditCategoryError] = useState("");

  // Ako nije admin, vrati ga
  if (!isAdmin) {
    navigate("/home", { replace: true });
    return null;
  }

  // State za podatke
  const [auctions, setAuctions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState<{type:'product'|'category',item:any}|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAuction, setSelectedAuction] = useState<any|null>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [allBids, setAllBids] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [userBids, setUserBids] = useState<any[]>([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any|null>(null);
  const [userBidsLoading, setUserBidsLoading] = useState(false);
  const [userBidsError, setUserBidsError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/auctions"),
      api.get("/categories"),
      api.get("/products"),
      api.get("/bids"),
      api.get("/users"), // Dodato za korisnike
    ])
      .then(([a, c, p, b, u]) => {
        setAuctions(Array.isArray(a.data) ? a.data : a.data?.data || a.data?.auctions || []);
        setCategories(Array.isArray(c.data) ? c.data : c.data?.categories || c.data?.data || []);
        setProducts(Array.isArray(p.data) ? p.data : p.data?.data || []);
        setAllBids(Array.isArray(b.data) ? b.data : b.data?.bids || b.data?.data || []);
        setUsers(Array.isArray(u.data) ? u.data : u.data?.users || u.data?.data || []);
      })
      .catch(() => setError("Greška pri učitavanju podataka."))
      .finally(() => setLoading(false));
  }, []);

  // Funkcija za klik na korisnika
  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setUserModalOpen(true);
    setUserBidsLoading(true);
    setUserBidsError("");
    api.get(`/users/${user.id}/bids`)
      .then((res) => {
        setUserBids(Array.isArray(res.data) ? res.data : res.data?.bids || res.data?.data || []);
      })
      .catch(() => setUserBidsError("Greška pri učitavanju bidova."))
      .finally(() => setUserBidsLoading(false));
  };

  // Funkcija za otvaranje modala i učitavanje bidova za aukciju
  const handleAuctionClick = (auction: any) => {
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
                        <button style={{background:'#fbbf24',color:'#3B0270',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={() => {
                          setEditAuctionDesc(selectedAuction?.description || "");
                          setEditAuctionEnd(selectedAuction?.end_time ? selectedAuction.end_time.slice(0,16) : "");
                          setEditAuctionError("");
                          setEditAuctionModalOpen(true);
                        }}>Izmeni</button>
                      </div>
                    </div>
                  </Modal>
                  {/* Modal za izmenu aukcije */}
                  <Modal open={editAuctionModalOpen} onClose={()=>setEditAuctionModalOpen(false)}>
                    <div style={{background:'#fff', borderRadius:10, padding:20, color:'#3B0270', minWidth:260}}>
                      <h3 style={{marginTop:0, marginBottom:16, color:'#7c3aed'}}>Izmeni aukciju</h3>
                      <form onSubmit={async e => {
                        e.preventDefault();
                        setEditAuctionLoading(true);
                        setEditAuctionError("");
                        try {
                          await api.put(`/auctions/${selectedAuction.id}`, {
                            description: editAuctionDesc,
                            end_time: editAuctionEnd
                          });
                          setAuctions(prev => prev.map((a:any) => a.id === selectedAuction.id ? { ...a, description: editAuctionDesc, end_time: editAuctionEnd } : a));
                          setEditAuctionModalOpen(false);
                          setModalOpen(false);
                        } catch {
                          setEditAuctionError('Greška pri izmeni aukcije.');
                        } finally {
                          setEditAuctionLoading(false);
                        }
                      }}>
                        <div style={{marginBottom:14}}>
                          <label style={{fontWeight:600}}>Opis aukcije:</label><br/>
                          <textarea value={editAuctionDesc} onChange={e=>setEditAuctionDesc(e.target.value)} style={{width:'100%',padding:'8px',borderRadius:6,border:'1px solid #ccc',marginTop:4,minHeight:60}}/>
                        </div>
                        <div style={{marginBottom:14}}>
                          <label style={{fontWeight:600}}>Datum završetka:</label><br/>
                          <input type="datetime-local" value={editAuctionEnd} onChange={e=>setEditAuctionEnd(e.target.value)} style={{width:'100%',padding:'8px',borderRadius:6,border:'1px solid #ccc',marginTop:4}}/>
                        </div>
                        {editAuctionError && <p style={{color:'red',marginBottom:10}}>{editAuctionError}</p>}
                        <div style={{display:'flex',gap:12,marginTop:8}}>
                          <button type="button" style={{background:'#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={()=>setEditAuctionModalOpen(false)}>Otkaži</button>
                          <button type="submit" style={{background:'#22c55e',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} disabled={editAuctionLoading}>{editAuctionLoading ? 'Čuvam...' : 'Potvrdi'}</button>
                        </div>
                      </form>
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
                  <div style={{display:'flex',gap:12,marginBottom:12}}>
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
                    <button style={{background:'#fbbf24',color:'#3B0270',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={() => {
                      if(deleteModal.type==='product'){
                        setEditProductName(deleteModal.item.name);
                        setEditProductError("");
                        setEditProductModalOpen(true);
                      }else{
                        setEditCategoryName(deleteModal.item.name);
                        setEditCategoryError("");
                        setEditCategoryModalOpen(true);
                      }
                    }}>Izmeni</button>
                  </div>
                </div>
              </Modal>
            )}
            {/* Modal za izmenu proizvoda */}
            <Modal open={editProductModalOpen} onClose={()=>setEditProductModalOpen(false)}>
              <div style={{background:'#fff', borderRadius:10, padding:20, color:'#3B0270', minWidth:260}}>
                <h3 style={{marginTop:0, marginBottom:16, color:'#7c3aed'}}>Izmeni proizvod</h3>
                <form onSubmit={async e => {
                  e.preventDefault();
                  if(!editProductName.trim()){
                    setEditProductError('Ime proizvoda je obavezno!');
                    return;
                  }
                  setEditProductLoading(true);
                  setEditProductError("");
                  try {
                    await api.put(`/products/${deleteModal?.item.id}`, {
                      name: editProductName
                    });
                    setProducts(prev => prev.map((p:any) => p.id === deleteModal?.item.id ? { ...p, name: editProductName } : p));
                    setEditProductModalOpen(false);
                    setDeleteModal(null);
                  } catch {
                    setEditProductError('Greška pri izmeni proizvoda.');
                  } finally {
                    setEditProductLoading(false);
                  }
                }}>
                  <div style={{marginBottom:14}}>
                    <label style={{fontWeight:600}}>Ime proizvoda:</label><br/>
                    <input type="text" value={editProductName} onChange={e=>setEditProductName(e.target.value)} style={{width:'100%',padding:'8px',borderRadius:6,border:'1px solid #ccc',marginTop:4}}/>
                  </div>
                  {editProductError && <p style={{color:'red',marginBottom:10}}>{editProductError}</p>}
                  <div style={{display:'flex',gap:12,marginTop:8}}>
                    <button type="button" style={{background:'#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={()=>setEditProductModalOpen(false)}>Otkaži</button>
                    <button type="submit" style={{background:'#22c55e',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} disabled={editProductLoading}>{editProductLoading ? 'Čuvam...' : 'Potvrdi'}</button>
                  </div>
                </form>
              </div>
            </Modal>
            {/* Modal za izmenu kategorije */}
            <Modal open={editCategoryModalOpen} onClose={()=>setEditCategoryModalOpen(false)}>
              <div style={{background:'#fff', borderRadius:10, padding:20, color:'#3B0270', minWidth:260}}>
                <h3 style={{marginTop:0, marginBottom:16, color:'#7c3aed'}}>Izmeni kategoriju</h3>
                <form onSubmit={async e => {
                  e.preventDefault();
                  if(!editCategoryName.trim()){
                    setEditCategoryError('Ime kategorije je obavezno!');
                    return;
                  }
                  setEditCategoryLoading(true);
                  setEditCategoryError("");
                  try {
                    await api.put(`/categories/${deleteModal?.item.id}`, {
                      name: editCategoryName
                    });
                    setCategories(prev => prev.map((c:any) => c.id === deleteModal?.item.id ? { ...c, name: editCategoryName } : c));
                    setEditCategoryModalOpen(false);
                    setDeleteModal(null);
                  } catch {
                    setEditCategoryError('Greška pri izmeni kategorije.');
                  } finally {
                    setEditCategoryLoading(false);
                  }
                }}>
                  <div style={{marginBottom:14}}>
                    <label style={{fontWeight:600}}>Ime kategorije:</label><br/>
                    <input type="text" value={editCategoryName} onChange={e=>setEditCategoryName(e.target.value)} style={{width:'100%',padding:'8px',borderRadius:6,border:'1px solid #ccc',marginTop:4}}/>
                  </div>
                  {editCategoryError && <p style={{color:'red',marginBottom:10}}>{editCategoryError}</p>}
                  <div style={{display:'flex',gap:12,marginTop:8}}>
                    <button type="button" style={{background:'#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={()=>setEditCategoryModalOpen(false)}>Otkaži</button>
                    <button type="submit" style={{background:'#22c55e',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} disabled={editCategoryLoading}>{editCategoryLoading ? 'Čuvam...' : 'Potvrdi'}</button>
                  </div>
                </form>
              </div>
            </Modal>
      </div>
      {/* Wrapper za dva bloka: bidovi i korisnici */}
      <div style={{display:'flex', gap: '32px', justifyContent:'center', marginTop: '50px', marginBottom: '40px', flexWrap:'wrap'}}>
        <div className="admin-bids-block" style={{minWidth:320, maxWidth:400, flex:1}}>
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
        <div className="admin-bids-block" style={{minWidth:320, maxWidth:400, flex:1}}>
          <h2>Svi korisnici</h2>
          {loading ? <p>Učitavanje...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
            <ul className="admin-bids-list">
              {users.map((user:any) => (
                <li key={user.id} className="admin-list-clickable" style={{cursor:'pointer'}} onClick={()=>handleUserClick(user)}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}
          {/* Modal za bidove korisnika */}
          <Modal open={userModalOpen} onClose={()=>setUserModalOpen(false)}>
            <div style={{background:'#fff', borderRadius:10, padding:20, color:'#3B0270'}}>
              <h3 style={{marginTop:0, marginBottom:16, color:'#7c3aed'}}>Bidovi za korisnika: {selectedUser?.name}</h3>
              {userBidsLoading ? (
                <p>Učitavanje...</p>
              ) : userBidsError ? (
                <p style={{color:'red'}}>{userBidsError}</p>
              ) : userBids.length === 0 ? (
                <p>Korisnik nema bidova.</p>
              ) : (
                <ul style={{listStyle:'none',padding:0}}>
                  {userBids.map((bid:any) => (
                    <li key={bid.id} style={{borderBottom:'1px solid #eee',padding:'8px 0'}}>
                      <strong>Aukcija:</strong> {bid.auction?.title || bid.auction_id || 'Nepoznato'}<br/>
                      <strong>Iznos:</strong> {bid.amount}
                    </li>
                  ))}
                </ul>
              )}
              <div style={{display:'flex',gap:12,marginTop:18}}>
                <button style={{background:'#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={()=>setUserModalOpen(false)}>Zatvori</button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AdminAdd;
