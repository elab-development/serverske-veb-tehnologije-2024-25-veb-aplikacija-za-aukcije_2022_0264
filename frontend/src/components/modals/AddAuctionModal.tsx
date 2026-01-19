import { useState } from "react";
import api from "../../api/api";
import "../../styles/modals.css";

interface AddAuctionModalProps {
  onClose: () => void;
}

const AddAuctionModal = ({ onClose }: AddAuctionModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [productId, setProductId] = useState("");
  const [endDate, setEndDate] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Učitaj proizvode
  useState(() => {
    api.get("/products").then((res) => {
      setProducts(res.data?.data || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auctions", {
        title,
        description,
        starting_price: startPrice,
        product_id: productId,
        end_date: endDate,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greška pri dodavanju aukcije");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Dodaj aukciju</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {success ? (
          <div className="modal-success">
            <p>✓ Aukcija uspešno dodata!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Naziv aukcije *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Unesite naziv aukcije"
              />
            </div>

            <div className="form-group">
              <label>Proizvod *</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              >
                <option value="">Izaberite proizvod</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Početna cena *</label>
              <input
                type="number"
                step="0.01"
                value={startPrice}
                onChange={(e) => setStartPrice(e.target.value)}
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Završetak aukcije *</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Opis</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Unesite opis aukcije"
                rows={3}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="modal-buttons">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Otkaži
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "Dodavanje..." : "Dodaj aukciju"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAuctionModal;
