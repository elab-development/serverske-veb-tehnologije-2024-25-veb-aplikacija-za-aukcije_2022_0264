import { useEffect, useState } from "react";
import api from "../api/api";
import Navigation from "../components/NavigationLogin";
import Card from "../components/CategoriesCard";
import "../styles/categories.css";

type Category = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null; // ako imaš u bazi
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
                onPrimaryAction={() => {
                  // primer akcije: vodi na products i prosledi category_id
                  window.location.href = `/products?category_id=${c.id}`;
                }}
                secondaryActionLabel="Detalji"
                onSecondaryAction={() => alert(`Kategorija: ${c.name}`)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
