import "../styles/Mogucnosti.css";
import AuthNavigation from "../components/AuthNavigation";
import { useEffect, useState } from "react";
import axios from "axios";


interface ApiData {
  title: string;
  info: string;
  link?: string;
}

export default function Mogucnosti() {
  const [gsa, setGsa] = useState<any[]>([]);
  const [prozorro, setProzorro] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("/api/external/gsa-auctions").then(res => res.data),
      axios.get("/api/external/prozorro-auctions").then(res => res.data)
    ]).then(([gsaData, prozorroData]) => {
      let gsaList = Array.isArray(gsaData.data) && gsaData.data.length > 0 ? gsaData.data : [
        { id: 1, title: "GSA aukcija 1", price: 100 },
        { id: 2, title: "GSA aukcija 2", price: 200 },
        { id: 3, title: "GSA aukcija 3", price: 300 }
      ];
      let prozorroList = Array.isArray(prozorroData.data) && prozorroData.data.length > 0 ? prozorroData.data : [
        { id: 1, title: "ProZorro aukcija A", price: 150 },
        { id: 2, title: "ProZorro aukcija B", price: 250 },
        { id: 3, title: "ProZorro aukcija C", price: 350 }
      ];
      setGsa(gsaList);
      setProzorro(prozorroList);
    }).catch(() => {
      setGsa([
        { id: 1, title: "GSA aukcija 1", price: 100 },
        { id: 2, title: "GSA aukcija 2", price: 200 },
        { id: 3, title: "GSA aukcija 3", price: 300 }
      ]);
      setProzorro([
        { id: 1, title: "ProZorro aukcija A", price: 150 },
        { id: 2, title: "ProZorro aukcija B", price: 250 },
        { id: 3, title: "ProZorro aukcija C", price: 350 }
      ]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mogucnosti-page">
      <AuthNavigation mode="dark" />
      <div className="mogucnosti-container">
        <div className="mogucnosti-left">
          <h2>Mogućnosti platforme</h2>
          <ul>
            <li>Brza registracija i početak korišćenja</li>
            <li>Sigurne aukcije i podrška 24/7</li>
            <li>Jednostavno praćenje ponuda i proizvoda</li>
          </ul>
        </div>
        <div className="mogucnosti-right">
          <h2>Ovde možete videti podatke iz eksternih aukcijskih servisa:</h2>
          {loading ? <p>Učitavanje...</p> : (
            <>
              <div className="api-block">
                <strong>GSA Aukcije</strong>
                <ul>
                  {gsa.map((item: any) => (
                    <li key={item.id}>{JSON.stringify(item)}</li>
                  ))}
                </ul>
              </div>
              <div className="api-block">
                <strong>ProZorro Aukcije</strong>
                <ul>
                  {prozorro.map((item: any) => (
                    <li key={item.id}>{JSON.stringify(item)}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          <h3 style={{marginTop:32}}>Pokrenite nove mogućnosti i uđite u svet aukcija!</h3>
          <button
            className="mogucnosti-download"
            onClick={() => window.location.href = "http://127.0.0.1:8000/api/auctions/export"}
          >
            SKINI FAJL
          </button>
        </div>
      </div>
      <footer className="mogucnosti-footer">&copy; {new Date().getFullYear()} Aukcijska platforma. Sva prava zadržana.</footer>
    </div>
  );
}
