import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import MyBids from "./pages/MyBids";
import AdminAdd from "./pages/Dashboard";
import ActiveAuctions from "./pages/ActiveAuctions";
function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Root: ako ima token -> /home, ako nema -> /login */}
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/products" element={<Products/>} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-bids"
          element={
            <PrivateRoute>
              <MyBids />
            </PrivateRoute>
          }
        />

        <Route
          path="/active-auctions"
          element={
            <PrivateRoute>
              <ActiveAuctions />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/add"
          element={
            <PrivateRoute>
              <AdminAdd />
            </PrivateRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}


