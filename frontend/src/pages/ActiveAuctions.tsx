import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Modal from "../components/Modal";
import "../styles/activeauctions.css";
import AuthNavigation from "../components/AuthNavigation";
import Button from "../components/Button";
import Footer from "../components/Footer";
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

export default function ActiveAuctionsPage() {
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState<Auction[]>([]);
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

    loadAuctions();
  }, [navigate]);

  const loadAuctions = async () => {
    setLoadingAuctions(true);
    setError("");

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
      setError("Greška pri učitavanju aukcija.");
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

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction || !bidAmount) return;

    setBidSubmitting(true);
    setBidError("");

    try {
      const amount = Number(bidAmount);
      if (isNaN(amount) || amount <= 0) {
        setBidError("Unesite validnu vrednost.");
        setBidSubmitting(false);
        return;
      }

      const currentPrice = Number(
        selectedAuction.current_price ??
          selectedAuction.start_price ??
          selectedAuction.starting_price ??
          0
      );

      if (amount <= currentPrice) {
        setBidError(
          `Ponuda mora biti veća od trenutne cene ($${currentPrice.toFixed(2)})`
        );
        setBidSubmitting(false);
        return;
      }

      const res = await api.post("/bids", {
        amount,
        auction_id: selectedAuction.id,
      });

      if (res.status === 201) {
        setModalOpen(false);
        setBidAmount("");
        loadAuctions();
        alert("Ponuda je uspešno postavljena!");
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || "Greška pri postavljanju ponude.";
      setBidError(message);
    } finally {
      setBidSubmitting(false);
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Završena";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <>
      <AuthNavigation mode="dark" />

      <div className="activeauctions-wrapper">
        <img src="../../public/images/assets/ring1.png" alt="Background" className="ring1"></img>
        <img src="../../public/images/assets/ring2.png" alt="Background" className="ring2"></img>
        <img src="../../public/images/assets/ring3.png" alt="Background" className="ring3"></img>
        <img src="../../public/images/assets/ring4.png" alt="Background" className="ring4"></img>
        <div className="activeauctions-container">
          <div className="activeauctions-header">
            <h1 className="activeauctions-title">Dostupne aukcije</h1>
            <p className="activeauctions-subtitle">
              {auctions.length} aktivnih {auctions.length === 1 ? "aukcija" : "aukcije"}
            </p>
          </div>

          {error && <div className="activeauctions-error">{error}</div>}

          {loadingAuctions && (
            <div className="activeauctions-loading">
              <p>⏳ Učitavanje aukcija...</p>
            </div>
          )}

          {!loadingAuctions && auctions.length === 0 && (
            <div className="activeauctions-empty">
              <p>Nema aktivnih aukcija u ovom trenutku.</p>
            </div>
          )}

          {!loadingAuctions && auctions.length > 0 && (
            <div className="activeauctions-grid">
              {auctions.map((auction) => {
                const price = Number(
                  auction.current_price ??
                    auction.start_price ??
                    auction.starting_price ??
                    0
                ).toFixed(2);

                const productName =
                  auction.product?.name ||
                  auction.product_name ||
                  auction.title ||
                  "Proizvod";

                const timeRemaining = getTimeRemaining(auction.end_time || "");

                return (
                  <div key={auction.id} className="activeauctions-card">
                    <div className="activeauctions-card-header">
                      <h3 className="activeauctions-product-name">{productName}</h3>
                      <span className="activeauctions-timer">{timeRemaining}</span>
                    </div>

                    <div className="activeauctions-card-body">
                      <div className="activeauctions-price-section">
                        <p className="activeauctions-label">Trenutna cena:</p>
                        <p className="activeauctions-price">${price}</p>
                      </div>

                      <div className="activeauctions-time-section">
                        <p className="activeauctions-label">Završava se:</p>
                        <p className="activeauctions-time">
                          {auction.end_time
                            ? new Date(auction.end_time).toLocaleDateString("sr-RS", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => handleBidClick(auction)}
                    >
                      Napravi ponudu
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="modal-h2">Napravi ponudu</h2>
          <p className="modal-auction-name">
            {selectedAuction?.product?.name ||
              selectedAuction?.title ||
              "Aukcija"}
          </p>

          <div className="modal-info">
            <p>
              Trenutna cena:{" "}
              <strong>
                ${Number(
                  selectedAuction?.current_price ??
                    selectedAuction?.start_price ??
                    selectedAuction?.starting_price ??
                    0
                ).toFixed(2)}
              </strong>
            </p>
          </div>

          <form onSubmit={handleBidSubmit} className="modal-form">
            <input
              type="number"
              placeholder="Unesite vašu ponudu..."
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min="0"
              step="0.01"
              required
              disabled={bidSubmitting}
              className="modal-input"
            />

            {bidError && <p className="modal-error">{bidError}</p>}

            <div className="modal-buttons">
              <Button
                variant="secondary"
                onClick={() => setModalOpen(false)}
                disabled={bidSubmitting}
              >
                Otkaži
              </Button>
              <Button
                variant="secondary"
                type="submit"
                disabled={bidSubmitting || !bidAmount}
              >
                {bidSubmitting ? "Slanje..." : "Pošalji ponudu"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      <Footer />
    </>
  );
}
