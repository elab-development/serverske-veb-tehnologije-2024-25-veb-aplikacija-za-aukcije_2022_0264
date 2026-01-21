import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/login.css";
import Button from "../components/Button.tsx";


export default function LoginPage() {
  const navigate = useNavigate();

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // REGISTER POPUP
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // ako vec postoji token -> idi na home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home", { replace: true });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await api.post("/login", { email, password });

      const token =
        res.data?.access_token ||
        res.data?.token ||
        res.data?.data?.access_token ||
        res.data?.data?.token;

      if (!token) {
        setLoginError("Token nije vraćen iz API-ja. Proveri login response.");
        return;
      }

      localStorage.setItem("token", token);

      
      const isAdmin = res.data?.user?.is_admin || false;
      localStorage.setItem("is_admin", JSON.stringify(isAdmin));

      navigate("/home", { replace: true });
    } catch (err) {
      setLoginError("Pogrešan email ili lozinka.");
    } finally {
      setLoginLoading(false);
    }
  };

  const openRegister = () => {
    setRegError("");
    setRegSuccess(false);
    setShowRegister(true);
  };

  const closeRegister = () => {
    setShowRegister(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);

    try {
      await api.post("/register", {
        name: regName,
        email: regEmail,
        password: regPassword,
      });

      setRegSuccess(true);

      setEmail(regEmail);
      setPassword(regPassword);

      setTimeout(() => {
        setShowRegister(false);
        setRegSuccess(false);
      }, 1200);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? "Proveri podatke (email možda već postoji)."
          : "Registracija nije uspela.");
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="login-layout">
      {/* Leva strana */}
      <div className="login-left">
        {/* Logo gore levo */}
        <div className="login-left-logo">
          <img src="/images/logo/logo.png" alt="Logo loginpage" className="logo-img" />
        </div>


        {/* Tekst dole */}
        <div className="login-left-footer">
          <h4 className="h4-login">Možeš lako da</h4>
          <h1 className="h1-login2">Postavljaš ponude na aukcije koje su aktivne kao i da pretražuješ proizvode koje se nalaze na aukcijama</h1>
        </div>

        <div className="login-left1">
          <div className="login-left-overlay"></div>
        </div>
      </div>

      {/* Desna strana */}
      <div className="login-right">
        <div className="login-card">
          <h1 className="h1-login3">Dobrodosli nazad</h1>
          <p className="login-paragraph">Prijavite se na svoj nalog kako biste učestvovali u aukcijama, pratili svoje ponude</p>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {loginError && <p className="error-text">{loginError}</p>}

            {/* Reusable Button - login */}
            <Button type="submit" variant="primary" disabled={loginLoading}>
              {loginLoading ? "Prijavljivanje..." : "Prijavi se"}
            </Button>


          </form>

          <div className="register-hint">
            Ukoliko nemate nalog,{" "}
            <Button type="button" variant="link" onClick={openRegister}>
              registrujte se
            </Button>
            .
          </div>

          {/* Dugmići za Kategorije i Proizvode */}
          <div className="login-extra-actions">
            <h2>
              Ili istrazite kategorije i proizvode bez prijave:
            </h2>
            <div className="login-extra-actions1">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/categories")}
              >
                Idi na kategorije
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/products")}
              >
                Idi na proizvode
              </Button>
            </div >
            <div className="login-extra-actions2">
              
            </div>


          </div>
        </div>
      </div>

      {showRegister && (
        <div className="modal-backdrop" onClick={closeRegister}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Registracija</h3>
              <button onClick={closeRegister}>✕</button>
            </div>

            <form onSubmit={handleRegister} className="modal-form">
              <input
                type="text"
                placeholder="Ime"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Lozinka"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />

              {regError && <p className="error-text">{regError}</p>}
              {regSuccess && (
                <p className="success-text">Uspešno ste se registrovali</p>
              )}

              {/* Reusable Button - register */}
              <Button
                type="submit"
                variant="primary"
                disabled={regLoading || regSuccess}
              >
                {regLoading ? "Registracija..." : "Registruj se"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>

  );
}

