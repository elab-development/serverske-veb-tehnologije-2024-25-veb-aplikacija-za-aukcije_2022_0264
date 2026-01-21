import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Modal from "../components/Modal";
import "../styles/mybids.css";
import AuthNavigation from "../components/AuthNavigation";


type Bid = {
  id: number;
  amount: number;
  auction_id: number;
  user_id: number;
  created_at: string;
  auction?: {
    id: number;
    title?: string;
    current_price?: number;
    product?: {
      id: number;
      name: string;
      price: number;
    };
  };
};

type Auction = {
  id: number;
  product_name?: string;
  title?: string;
  current_price?: number;
  start_price?: number;
  starting_price?: number;
  start_time?: string;
  end_time?: string;
  product?: {
    id: number;
    name: string;
  };
};



export default function MyBidsPage() {
  const navigate = useNavigate();

  const [bids, setBids] = useState<Bid[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);

  const [loadingBids, setLoadingBids] = useState(true);
  const [loadingAuctions, setLoadingAuctions] = useState(true);
  const [error, setError] = useState("");


  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSubmitting, setBidSubmitting] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    loadBids();
    loadAuctions();
  }, [navigate]);



  const loadBids = async () => {
    setLoadingBids(true);
    setError("");

    try {
      const res = await api.get("/user/bids");
      const data = res.data?.bids ?? res.data?.data ?? [];
      setBids(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Greška pri učitavanju ponuda.");
    } finally {
      setLoadingBids(false);
    }
  };



  const loadAuctions = async () => {
    setLoadingAuctions(true);

    try {
      const res = await api.get("/auctions");
      const data = res.data?.data ?? res.data?.auctions ?? [];

      const activeAuctions = Array.isArray(data)
        ? data.filter((auction: Auction) => {
          if (!auction.end_time) return false;
          const end = new Date(auction.end_time);
          return !isNaN(end.getTime()) && end > new Date();
        })
        : [];

      setAuctions(activeAuctions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAuctions(false);
    }
  };



  const handleBidClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setBidAmount("");
    setBidError("");
    setModalOpen(true);
  };

  const handleSubmitBid = async () => {
    if (!selectedAuction || !bidAmount) {
      setBidError("Unesite iznos ponude.");
      return;
    }

    const amount = Number(bidAmount);
    const currentPrice = Number(
      selectedAuction.current_price ??
      selectedAuction.start_price ??
      selectedAuction.starting_price ??
      0
    );

    if (amount <= currentPrice) {
      setBidError(`Iznos mora biti veći od ${currentPrice.toFixed(2)}`);
      return;
    }

    setBidSubmitting(true);

    try {
      await api.post("/bids", {
        auction_id: selectedAuction.id,
        amount,
      });

      setModalOpen(false);
      loadBids();
      loadAuctions();
      alert("Ponuda uspešno poslata!");
    } catch (err: any) {
      setBidError(err.response?.data?.error || "Greška pri slanju ponude.");
    } finally {
      setBidSubmitting(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <>
      <AuthNavigation  mode="dark"/>
      <div className="mybids-wrapper">
        <div className="mybids-container">

          <div className="mybids-grid">
            {/* ================= LEFT: USER BIDS ================= */}
            <div className="mybids-section">
              <h3>Moje ponude</h3>

              {loadingBids && <p>⏳ Učitavanje ponuda...</p>}
              {!loadingBids && error && <p className="mybids-error">{error}</p>}

              {!loadingBids && bids.length === 0 && (
                <p className="mybids-empty">Nemate trenutnih ponuda.</p>
              )}

              {!loadingBids && bids.length > 0 && (
                <div className="mybids-list">
                  {bids.map((bid) => (
                    <div key={bid.id} className="mybids-item">
                      <p>
                        Iznos: <strong>${Number(bid.amount).toFixed(2)}</strong>
                      </p>
                      <p>Aukcija: {bid.auction?.title || bid.auction?.product?.name}</p>
                      <p>
                        Datum:{" "}
                        {new Date(bid.created_at).toLocaleDateString("sr-RS")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= RIGHT: AUCTIONS ================= */}
            <div className="mybids-section">
              <h3>Dostupne aukcije</h3>

              {loadingAuctions && <p>⏳ Učitavanje aukcija...</p>}

              {!loadingAuctions && auctions.length === 0 && (
                <p className="mybids-empty">Nema aktivnih aukcija.</p>
              )}

              {!loadingAuctions && auctions.length > 0 && (
                <div className="mybids-list">
                  {auctions.map((auction) => {
                    const price = Number(
                      auction.current_price ??
                      auction.start_price ??
                      auction.starting_price ??
                      0
                    ).toFixed(2);

                    return (
                      <div key={auction.id} className="mybids-auction-item">
                        <p className="mybids-auction-name">
                          {auction.product?.name ||
                            auction.product_name ||
                            auction.title ||
                            "Proizvod"}
                        </p>

                        <p>
                          Trenutna cena: <strong>${price}</strong>
                        </p>

                        <p>
                          Završava se:{" "}
                          {auction.end_time
                            ? new Date(auction.end_time).toLocaleDateString("sr-RS")
                            : "—"}
                        </p>

                        <button
                          className="mybids-button"
                          onClick={() => handleBidClick(auction)}
                        >
                          Uloži ponudu
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ================= MODAL ================= */}
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="mybids-modal-content">
              <h3>
                Ponuda za{" "}
                {selectedAuction?.product?.name ||
                  selectedAuction?.product_name ||
                  "aukciju"}
              </h3>

              <p>
                Trenutna cena: $
                {Number(
                  selectedAuction?.current_price ??
                  selectedAuction?.start_price ??
                  0
                ).toFixed(2)}
              </p>

              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Unesite iznos"
              />

              {bidError && <p className="mybids-error">{bidError}</p>}

              <div className="mybids-modal-buttons">
                <button onClick={handleSubmitBid} disabled={bidSubmitting}>
                  {bidSubmitting ? "Slanje..." : "Potvrdi"}
                </button>
                <button onClick={() => setModalOpen(false)}>Otkaži</button>
              </div>
            </div>
          </Modal>


        </div>
      </div>
    </>

  );
}