import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Button from "../components/Button";
import "../styles/login.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      await api.post("/forgot-password", { email });

      
      setMsg("Ako nalog postoji, poslali smo link za reset lozinke na email.");
    } catch (e: any) {
      
      setMsg("Ako nalog postoji, poslali smo link za reset lozinke na email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <div className="login-right" style={{ width: "100%" }}>
        <div className="login-card">
          <h1 className="h1-login3">Zaboravljena lozinka</h1>
          <p className="login-paragraph">
            Unesite email i poslaćemo vam link za promenu lozinke.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {err && <p className="error-text">{err}</p>}
            {msg && <p className="success-text">{msg}</p>}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Slanje..." : "Pošalji link"}
            </Button>

            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/login")}
            >
              Nazad na prijavu
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
