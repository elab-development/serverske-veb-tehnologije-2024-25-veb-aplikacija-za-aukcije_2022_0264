import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/auctions.css";


interface Auction {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  starting_price?: number;
  current_price?: number;
  ends_at?: string;
  [key: string]: any;
}

interface AuctionListProps {
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

export default function AuctionList({
  isLoggedIn,
  onRequireLogin,
}: AuctionListProps) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidMessage, setBidMessage] = useState<string>("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auctions");

        console.log("Auctions API response:", res.data);

        let list: any = res.data;

        // pokušaćemo par najčešćih formata
        if (Array.isArray(list)) {
          // OK, direktno niz
        } else if (Array.isArray(list.data)) {
          list = list.data;
        } else if (Array.isArray(list.auctions)) {
          list = list.auctions;
        } else {
          setError("Neočekivan format podataka sa /api/auctions.");
          setLoading(false);
          return;
        }

        setAuctions(list);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Greška pri učitavanju aukcija.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleBid = async (auction: Auction) => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }

    try {
      const amount =
        (auction.current_price ?? auction.starting_price ?? 0) + 1;

      const res = await api.post("/bids", {
        auction_id: auction.id,
        amount,
      });

      console.log("Bid response:", res.data);
      setBidMessage(
        `Uspešno si ponudila ${amount} za ${
          auction.title || auction.name || "aukciju #" + auction.id
        }.`
      );
    } catch (err) {
      console.error(err);
      setBidMessage(
        "Greška pri slanju ponude. Proveri da li /api/bids prima prava polja."
      );
    }
  };

  if (loading) {
    return <p>Učitavanje aukcija...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!Array.isArray(auctions)) {
    return <p>Podaci o aukcijama nisu u očekivanom formatu.</p>;
  }

  return (
    <div>
      <h2>Aktivne aukcije</h2>

      {auctions.length === 0 && <p>Trenutno nema aukcija.</p>}

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginTop: 16,
        }}
      >
        {auctions.map((auction) => (
          <div
            key={auction.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              background: "#fff",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {auction.title || auction.name || `Aukcija #${auction.id}`}
            </h3>

            {auction.description && (
              <p style={{ fontSize: 14, color: "#555" }}>
                {auction.description}
              </p>
            )}

            <p style={{ margin: "4px 0" }}>
              <strong>Početna cena:</strong>{" "}
              {auction.starting_price ?? "-"}
            </p>

            {auction.current_price !== undefined && (
              <p style={{ margin: "4px 0" }}>
                <strong>Trenutna cena:</strong> {auction.current_price}
              </p>
            )}

            {auction.ends_at && (
              <p style={{ margin: "4px 0", fontSize: 12 }}>
                Završava se: {auction.ends_at}
              </p>
            )}

            <button
              onClick={() => handleBid(auction)}
              style={{ marginTop: 8, padding: "6px 10px", backgroundColor:'#3B0270' }}
            >
              Napravi bid
            </button>
          </div>
        ))}
      </div>

      {bidMessage && (
        <p style={{ marginTop: 16, color: "green" }}>{bidMessage}</p>
      )}
    </div>
  );
}
