import { useEffect, useState } from "react";
import api from "../api/api";
import Navigation from "../components/NavigationLogin";
import Card from "../components/CategoriesCard";
import "../styles/categories.css";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  category_id?: number;
  category?: {
    id: number;
    name: string;
  } | null;
};

// Slike proizvoda - direktna mapiranja na osnovu naziva proizvoda
const productImages: Record<string, string> = {
  // Electronics
  'iPhone 16 Pro Max': "/images/categories/7.png",
  'Samsung Galaxy S24 Ultra': "/images/categories/8.png",
  'Sony WH-1000XM5 Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'iPad Pro 12.9 M4': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
  
  // Home Appliances
  'Dyson V15 Vacuum Cleaner': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
  'Instant Pot Pro Max': "/images/categories/11.png",
  'LG OLED 65" Smart TV': "/images/categories/9.png",
  'DeLonghi Espresso Machine': "/images/categories/10.png",
  
  // Fashion
  'Gucci Marmont Leather Bag': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
  'Nike Air Jordan 1 Retro': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'Rolex Submariner Watch': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=300&fit=crop',
  'Prada Nylon Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
  
  // Books
  'The Great Gatsby - First Edition': 'https://images.unsplash.com/photo-1507842072343-583f20270319?w=400&h=300&fit=crop',
  'To Kill a Mockingbird - Signed Copy': 'https://images.unsplash.com/photo-1507842072343-583f20270319?w=400&h=300&fit=crop',
  '1984 - Hardcover Collection': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
  'Pride and Prejudice - Leather Bound': 'https://images.unsplash.com/photo-1507842072343-583f20270319?w=400&h=300&fit=crop',
  
  // Vehicles
  'Tesla Model 3 - 2024': 'https://images.unsplash.com/photo-1560958089-b8a63c51c446?w=400&h=300&fit=crop',
  'Honda Civic Sedan': 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
  
  // Art
  'Abstract Oil Painting - Modern Art': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
  'Limited Edition Photography Print': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
};

const getProductImage = (productName: string): string => {
  return productImages[productName] || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop';
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/products")
      .then((res) => {
        // Backend vraća paginated data u "data" polju
        const data = res.data?.data ?? [];
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setError("Ne mogu da učitam proizvode."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navigation />

      <div className="page-container">
        <h2 className="h2-category">Proizvodi</h2>

        {loading && <p>Učitavanje...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && products.length === 0 && <p>Nema proizvoda.</p>}

        {!loading && !error && products.length > 0 && (
          <div className="categories-grid">
            {products.map((p) => (
              <Card
                key={p.id}
                title={p.name}
                description={p.description || `Cena: $${p.price.toFixed(2)}`}
                imageUrl={getProductImage(p.name)}
                primaryActionLabel="Detalji"
                onPrimaryAction={() => alert(`Proizvod: ${p.name}`)}
                secondaryActionLabel="Prikaži kategoriju"
                onSecondaryAction={() => alert(`Kategorija: ${p.category?.name || 'Nema kategorije'}`)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
