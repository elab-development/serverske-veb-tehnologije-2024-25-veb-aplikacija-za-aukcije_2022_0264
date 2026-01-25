import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Button from "../components/Button";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPasswordPage() {
  const { token = "" } = useParams();
  const q = useQuery();
  const navigate = useNavigate();

  const email = q.get("email") || "";

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!token || !email) {
      setErr("Link nije ispravan (nedostaje token ili email).");
      return;
    }
    if (password !== password2) {
      setErr("Lozinke se ne poklapaju.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: password2,
      });

      setMsg("Lozinka je uspešno promenjena. Preusmeravamo na login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Reset lozinke nije uspeo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <div className="login-right" style={{ width: "100%" }}>
        <div className="login-card">
          <h1 className="h1-login3">Nova lozinka</h1>
          <p className="login-paragraph">Email: <b>{email}</b></p>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="password"
              placeholder="Nova lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Potvrdi novu lozinku"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />

            {err && <p className="error-text">{err}</p>}
            {msg && <p className="success-text">{msg}</p>}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Čuvanje..." : "Sačuvaj lozinku"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
