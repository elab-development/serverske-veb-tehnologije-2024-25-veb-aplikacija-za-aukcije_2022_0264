import { useEffect, useState } from "react";
import api from "../api/api";
import Navigation from "../components/NavigationLogin";
import Card from "../components/CategoriesCard";
import Modal from "../components/Modal";
import "../styles/categories.css";

type Category = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
};

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  category_id?: number;
};

const categoryImageById: Record<number, string> = {
  1: "/images/categories/1.png",
  2: "/images/categories/2.png",
  3: "/images/categories/3.png",
  4: "/images/categories/4.png",
  5: "/images/categories/5.png",
  6: "/images/categories/6.png",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/categories")
      .then((res) => {
        const raw = res.data?.categories;
        const list = Array.isArray(raw) ? raw : raw?.data ?? [];
        setCategories(list);
      })
      .catch(() => setError("Ne mogu da učitam kategorije."))
      .finally(() => setLoading(false));
  }, []);

  const handleShowProducts = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
    setProductsLoading(true);
    setProductsError("");

    api
      .get(`/products?category_id=${category.id}`)
      .then((res) => {
        const data = res.data?.data ?? [];
        setCategoryProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProductsError("Ne mogu da učitam proizvode."))
      .finally(() => setProductsLoading(false));
  };

  return (
    <>
      <Navigation />

      <div className="page-container">
        <h2 className="h2-category">Kategorije</h2>

        {loading && <p>Učitavanje...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && categories.length === 0 && <p>Nema kategorija.</p>}

        {!loading && !error && categories.length > 0 && (
          <div className="categories-grid">
            {categories.map((c) => (
              <Card
                key={c.id}
                title={c.name}
                description={c.description}
                imageUrl={categoryImageById[c.id] ?? "/images/categories/default.jpg"}
                primaryActionLabel="Prikaži proizvode"
                onPrimaryAction={() => handleShowProducts(c)}
                secondaryActionLabel="Detalji"
                onSecondaryAction={() => alert(`Kategorija: ${c.name}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal za proizvode po kategoriji */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 style={{ color: "white", marginTop: 0, marginBottom: "16px" }}>
          Proizvodi - {selectedCategory?.name}
        </h3>

        {productsLoading && <p style={{ color: "white" }}>Učitavanje...</p>}
        {productsError && <p style={{ color: "#ff6b6b" }}>{productsError}</p>}

        {!productsLoading && !productsError && categoryProducts.length === 0 && (
          <p style={{ color: "white" }}>Nema proizvoda iz ove kategorije.</p>
        )}

        {!productsLoading && !productsError && categoryProducts.length > 0 && (
          <ul style={{ color: "white", paddingLeft: "20px", margin: "0 0 16px 0" }}>
            {categoryProducts.map((p) => (
              <li key={p.id} style={{ marginBottom: "8px" }}>
                {p.name}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setModalOpen(false)}
          style={{
            width: "100%",
            padding: "10px",
            background: "#4ade80",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Zatvori
        </button>
      </Modal>
    </>
  );
}
