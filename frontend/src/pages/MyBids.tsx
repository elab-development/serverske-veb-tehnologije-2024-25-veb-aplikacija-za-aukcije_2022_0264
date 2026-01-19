import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/categories.css";

type Bid = {
  id: number;
  amount: number;
  auction_id: number;
  user_id: number;
  created_at: string;
  auction?: {
    id: number;
    product_name?: string;
    current_price?: number;
  };
};

export default function MyBidsPage() {
  const navigate = useNavigate();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    api
      .get("/user/bids")
      .then((res) => {
        const data = res.data?.bids ?? res.data?.data ?? [];
        setBids(Array.isArray(data) ? data : []);
      })
      .catch(() => setError("Ne mogu da učitam vaše ponude."))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      {/* Simple Back Navigation */}
      <nav
        style={{
          background: "#3B0270",
          padding: "16px 32px",
          display: "flex",
          gap: "16px",
        }}
      >
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 20px",
            background: "#4ade80",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Nazad na početnu
        </button>
      </nav>

      <div className="page-container">
        <h2 className="h2-category">Moje ponude</h2>

        {loading && <p style={{ color: "white" }}>Učitavanje...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!loading && !error && bids.length === 0 && (
          <p style={{ color: "white" }}>Nemate nikakvih ponuda.</p>
        )}

        {!loading && !error && bids.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
              maxWidth: "600px",
            }}
          >
            {bids.map((bid) => (
              <div
                key={bid.id}
                style={{
                  padding: "16px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  borderLeft: "4px solid #4ade80",
                  color: "white",
                }}
              >
                <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                  Ponuda: ${bid.amount.toFixed(2)}
                </p>
                <p style={{ margin: "0 0 8px 0", color: "#e0e0e0" }}>
                  Aukcija ID: {bid.auction_id}
                </p>
                <p style={{ margin: 0, color: "#b0b0b0", fontSize: "0.9em" }}>
                  Datum: {new Date(bid.created_at).toLocaleDateString("sr-RS")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
