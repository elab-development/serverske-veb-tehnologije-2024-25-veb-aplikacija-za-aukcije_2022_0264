import "../styles/Mogucnosti.css";
import AuthNavigation from "../components/AuthNavigation";
import { useEffect, useState } from "react";
import api from "../api/api";
import Footer from "../components/Footer";
import Button from "../components/Button";


export default function Mogucnosti() {
  const [gsa, setGsa] = useState<any[]>([]);
  const [prozorro, setProzorro] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      api.get("/external/gsa-auctions").then((res) => res.data),
      api.get("/external/prozorro-auctions").then((res) => res.data),
    ])
      .then(([gsaData, prozorroData]) => {
        console.log("GSA RAW:", gsaData);
        console.log("PROZORRO RAW:", prozorroData);

        const gsaResults = Array.isArray(gsaData?.data?.Results) ? gsaData.data.Results : [];

        const prozorroList = Array.isArray(prozorroData?.data) ? prozorroData.data : [];

        setGsa(gsaResults);
        setProzorro(prozorroList);
      })
      .catch((e) => {
        setError(e?.message ?? "Greška pri učitavanju eksternih podataka.");
        setGsa([]);
        setProzorro([]);
      })
      .finally(() => setLoading(false));
  }, []);


  return (

    <div className="mogucnosti-page">
      <AuthNavigation mode="dark" />
      <div className="mogucnosti-container">

        <div className="mogucnosti-hero">
          <h1>Mogućnosti platforme</h1>
          <ul className="mogucnosti-features">
            <li>Brza registracija i početak korišćenja</li>
            <li>Sigurne aukcije i podrška 24/7</li>
            <li>Jednostavno praćenje ponuda i proizvoda</li>
          </ul>
        </div>

        {/* ERROR + LOADING */}
        {error && <p className="mogucnosti-error">{error}</p>}
        {loading && <p className="mogucnosti-loading">Učitavanje...</p>}

        {/* 2 BLOKA: GSA / PROZORRO */}
        {!loading && (
          <div className="mogucnosti-two-cols">
            <div className="api-panel">
              <div className="api-panel__header">
                <h2>GSA Aukcije</h2>
                <span className="api-panel__sub">Prikaz prvih 5 rezultata</span>
              </div>

              <div className="prozorro-grid">
                {gsa.length === 0 ? (
                  <p style={{ opacity: 0.8 }}>Nema dostupnih GSA aukcija.</p>
                ) : (
                  gsa.slice(0, 5).map((item: any, index: number) => (
                    <div
                      className="prozorro-card"
                      key={`${item.saleNo ?? "sale"}-${item.lotNo ?? index}`}
                    >


                      <div className="prozorro-title"> Item :  {item.itemName ?? "Untitled"}</div>

                      <div className="prozorro-date">
                        Status: <b>{item.auctionStatus ?? "—"}</b>
                      </div>

                      <div className="prozorro-date">
                        Lokacija: {item.saleLocation ?? "—"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="api-panel">
              <div className="api-panel__header">
                <h2>ProZorro Aukcije</h2>
                <span className="api-panel__sub">Prikaz prvih 5 rezultata</span>
              </div>

              <div className="prozorro-grid">
                {prozorro.length === 0 ? (
                  <p style={{ opacity: 0.8 }}>Nema dostupnih ProZorro tendera.</p>
                ) : (
                  prozorro.slice(0, 5).map((item: any) => (
                    <div className="prozorro-card" key={item.id}>
                     

                      <div className="prozorro-id">
                       Tedner  {item.id.slice(0, 10)}…{item.id.slice(-6)}
                      </div>

                      <div className="prozorro-date">
                        {new Date(item.dateModified).toLocaleString()}
                      </div>

                      <a
                        href={`https://public-api-sandbox.prozorro.gov.ua/api/2.5/tenders/${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="prozorro-link"
                      >
                        Pogledaj tender
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* CSV DUGME NA DNU */}
        <div className="mogucnosti-actions">
          <h3>Preuzmi listu aukcija</h3>
          <Button
            variant="secondary"
            onClick={() =>
              (window.location.href = "http://127.0.0.1:8000/api/auctions/export")
            }
          >
            CSV
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
