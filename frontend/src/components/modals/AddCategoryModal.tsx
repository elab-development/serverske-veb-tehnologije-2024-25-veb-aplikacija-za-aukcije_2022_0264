import { useState } from "react";
import api from "../../api/api";
import "../../styles/modals.css";

interface AddCategoryModalProps {
  onClose: () => void;
}

const AddCategoryModal = ({ onClose }: AddCategoryModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/categories", {
        name,
        description,
        image_url: imageUrl,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Greška pri dodavanju kategorije");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Dodaj kategoriju</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {success ? (
          <div className="modal-success">
            <p>✓ Kategorija uspešno dodata!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Naziv kategorije *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Unesite naziv kategorije"
              />
            </div>

            <div className="form-group">
              <label>Opis</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Unesite opis kategorije"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>URL slike</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://primer.com/slika.jpg"
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
                {loading ? "Dodavanje..." : "Dodaj kategoriju"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCategoryModal;
