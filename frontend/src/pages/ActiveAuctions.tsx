import { useEffect, useMemo, useState } from "react";
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
  highest_bid?: number;
  product?: {
    id: number;
    name: string;
  };
};

type AuctionsApiResponse = {
  count?: number;
  page?: number;
  per_page?: number;
  data?: any; // može biti Auction[] ili { data: Auction[] } zavisno od Resource-a
  auctions?: Auction[];
};

function extractAuctions(payload: AuctionsApiResponse): Auction[] {
  const maybe = (payload as any)?.data;
  const items =
    (Array.isArray(maybe) ? maybe : null) ??
    (Array.isArray(maybe?.data) ? maybe.data : null) ??
    (Array.isArray((payload as any)?.auctions) ? (payload as any).auctions : null) ??
    [];
  return items as Auction[];
}

type Filters = {
  q: string;
  minStartPrice: string;
  maxStartPrice: string;
  sortBy: "created_at" | "end_time" | "start_price" | "highest_bid" | "title" | "id";
  startsBefore: string;
  sortDir: "asc" | "desc";
};

export default function ActiveAuctionsPage() {
  const navigate = useNavigate();

  // DATA + META
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loadingAuctions, setLoadingAuctions] = useState(true);
  const [error, setError] = useState("");

  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const defaults: Filters = {
    q: "",
    minStartPrice: "",
    maxStartPrice: "",
    startsBefore: "",
    sortBy: "created_at",
    sortDir: "asc",
  };

  const [draft, setDraft] = useState<Filters>(defaults);
  const [applied, setApplied] = useState<Filters>(defaults);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSubmitting, setBidSubmitting] = useState(false);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / perPage));
  }, [totalCount, perPage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);


  useEffect(() => {
    loadAuctions();
  }, [page, perPage, applied]);

  const loadAuctions = async () => {
    setLoadingAuctions(true);
    setError("");

    try {
      const nowIso = new Date().toISOString();

      const params: Record<string, any> = {
        page,
        per_page: perPage,
        sort_by: applied.sortBy,
        sort_dir: applied.sortDir,
        ends_after: nowIso,
      };

      if (applied.q.trim()) params.q = applied.q.trim();
      if (applied.minStartPrice !== "") params.min_start_price = Number(applied.minStartPrice);
      if (applied.maxStartPrice !== "") params.max_start_price = Number(applied.maxStartPrice);

      const res = await api.get<AuctionsApiResponse>("/auctions", { params });
      const payload = res.data;

      const items = extractAuctions(payload);

      setAuctions(items);
      setTotalCount(payload.count ?? items.length);
      setPage(payload.page ?? page);
      setPerPage(payload.per_page ?? perPage);
    } catch (err) {
      console.error(err);
      setError("Greška pri učitavanju aukcija.");
    } finally {
      setLoadingAuctions(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setApplied(draft);
  };

  const handleResetFilters = () => {
    setDraft(defaults);
    setApplied(defaults);
    setPerPage(5);
    setPage(1);
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
        setBidError(`Ponuda mora biti veća od trenutne cene ($${currentPrice.toFixed(2)})`);
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
        await loadAuctions();
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

  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];
    const windowSize = 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, page - windowSize);
    const end = Math.min(totalPages - 1, page + windowSize);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
    return pages;
  };

  return (
    <>
      <AuthNavigation mode="dark" />

      <div className="activeauctions-wrapper">
        <img src="../../public/images/assets/ring1.png" alt="Background" className="ring1" />
        <img src="../../public/images/assets/ring2.png" alt="Background" className="ring2" />
        <img src="../../public/images/assets/ring3.png" alt="Background" className="ring3" />
        <img src="../../public/images/assets/ring4.png" alt="Background" className="ring4" />

        <div className="activeauctions-container">
          <div className="activeauctions-header">
            <h1 className="activeauctions-title">Dostupne aukcije</h1>
            <p className="activeauctions-subtitle">
              {totalCount} aktivnih {totalCount === 1 ? "aukcija" : "aukcije"}
            </p>

          </div>

          <div className="activeauctions-filters">
            <div className="flex-horizontal">
              <div className="activeauctions-filter-row">

                <input
                  className="activeauctions-filter-input"
                  placeholder="Pretraga po nazivu"
                  value={draft.q}
                  onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />


                <input
                  className="activeauctions-filter-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Minimalna cena"
                  value={draft.minStartPrice}
                  onChange={(e) => setDraft((d) => ({ ...d, minStartPrice: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />

                <input
                  className="activeauctions-filter-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Maksimalna cena"
                  value={draft.maxStartPrice}
                  onChange={(e) => setDraft((d) => ({ ...d, maxStartPrice: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>

              <div className="activeauctions-filter-row">
                <select
                  className="activeauctions-filter-select"
                  value={draft.sortBy}
                  onChange={(e) => setDraft((d) => ({ ...d, sortBy: e.target.value as any }))}
                >
                  <option value="created_at">Najnovije</option>
                  <option value="end_time">Najpre se zavrsavaju</option>
                  <option value="start_price">Pocetna cena</option>
                  <option value="highest_bid">Najvisa ponuda</option>
                  <option value="title">Naziv</option>

                </select>

                <select
                  className="activeauctions-filter-select"
                  value={draft.sortDir}
                  onChange={(e) => setDraft((d) => ({ ...d, sortDir: e.target.value as any }))}
                >
                  <option value="desc">Opadajuće</option>
                  <option value="asc">Rastuće</option>
                </select>

                <select
                  className="activeauctions-filter-select"
                  value={perPage}
                  onChange={(e) => {
                    setPage(1);
                    setPerPage(Number(e.target.value));
                  }}
                >

                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>

                </select>

                <div className="buttons-filter">
                  <Button variant="secondary2" onClick={handleSearch}>
                    Pretraži
                  </Button>

                  <Button variant="secondary2" onClick={handleResetFilters}>
                    Resetuj filtere
                  </Button>
                </div>
              </div>

            </div>

          </div>
          {error && <div className="activeauctions-error">{error}</div>}

          {loadingAuctions && (
            <div className="activeauctions-loading">
              <p>Učitavanje aukcija...</p>
            </div>
          )}

          {!loadingAuctions && auctions.length === 0 && (
            <div className="activeauctions-empty">
              <p>Nema aktivnih aukcija u ovom trenutku.</p>
            </div>
          )}

          {!loadingAuctions && auctions.length > 0 && (
            <>
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

                      <Button variant="secondary" onClick={() => handleBidClick(auction)}>
                        Napravi ponudu
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="activeauctions-pagination">
                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Prethodna
                </Button>

                <div className="activeauctions-pagination-pages">
                  {getVisiblePages().map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="activeauctions-pagination-dots">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={`activeauctions-pagination-page ${p === page ? "is-active" : ""}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Sledeca
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="modal-h2">Napravi ponudu</h2>
          <p className="modal-auction-name">
            {selectedAuction?.product?.name || selectedAuction?.title || "Aukcija"}
          </p>

          <div className="modal-info">
            <p>
              Trenutna cena:{" "}
              <strong>
                $
                {Number(
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
              <Button variant="secondary" type="submit" disabled={bidSubmitting || !bidAmount}>
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

