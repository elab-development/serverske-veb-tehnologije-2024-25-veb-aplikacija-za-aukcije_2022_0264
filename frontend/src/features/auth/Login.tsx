// src/features/auth/Login.tsx
import { useState } from "react";
import api from "../../api/api";
import axios from "axios";
import "../../styles/auth.css";


interface LoginProps {
  onAuthSuccess: (token: string, message: string) => void;
  autoFocus?: boolean;
}

export default function Login({ onAuthSuccess, autoFocus }: LoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/login", { email, password });

      const accessToken = res.data.access_token as string;

      localStorage.setItem("access_token", accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const msg = res.data.message || "Uspešan login!";
      setMessage(msg);
      onAuthSuccess(accessToken, msg);
    } catch (err: any) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
        setMessage(
          `Greška pri logovanju ${status}: ${
            typeof data === "string" ? data : JSON.stringify(data)
          }`
        );
      } else {
        setMessage("Neočekivana greška na frontendu.");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
      });

      setMessage("Registracija uspešna! Sada se uloguj sa istim podacima.");
      console.log("Register response:", res.data);

      // Opcionalno: automatski prebacimo na login tab
      setMode("login");
    } catch (err: any) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
        setMessage(
          `Greška pri registraciji ${status}: ${
            typeof data === "string" ? data : JSON.stringify(data)
          }`
        );
      } else {
        setMessage("Neočekivana greška pri registraciji.");
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setMode("login")}
          style={{
            marginRight: 8,
            padding: "6px 12px",
            background: mode === "login" ? "#333" : "#eee",
            color: mode === "login" ? "#fff" : "#000",
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          style={{
            padding: "6px 12px",
            background: mode === "register" ? "#333" : "#eee",
            color: mode === "register" ? "#fff" : "#000",
          }}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <label>
            Email:
            <input
              type="email"
              value={email}
              autoFocus={autoFocus}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Lozinka:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Uloguj se</button>
        </form>
      ) : (
        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <label>
            Ime:
            <input
              type="text"
              value={name}
              autoFocus={autoFocus}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Lozinka:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Registruj se</button>
        </form>
      )}

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}

