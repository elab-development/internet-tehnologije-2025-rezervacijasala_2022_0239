import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  pricePerHour: number;
  imageUrl?: string;
  city?: { name: string };
  category?: { name: string };
};

export default function HallCard({ hall }: { hall: Hall }) {
  const { convertPrice } = useCurrency();
  const imageSrc = hall.imageUrl || `/images/halls/${hall.id}.jpg`;
  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: 16,
        overflow: "hidden",
        background: "var(--card-bg)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
      }}
    >
      <img
        src={imageSrc}
        alt={hall.name}
        onError={(e) => {
          // Ako slika ne postoji ni na jednom putu, postavi placeholder
          (e.target as HTMLImageElement).src = "/images/placeholder-hall.jpg";
        }}
        style={{ width: "100%", height: 160, objectFit: "cover" }}
      />

      <div style={{ padding: 14, display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0 }}>{hall.name}</h3>

        {hall.city?.name && (
          <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
            Grad: {hall.city.name}
          </p>
        )}

        {hall.category?.name && (
          <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
            Kategorija: {hall.category.name}
          </p>
        )}

        <p style={{ margin: 0, fontSize: 14 }}>Kapacitet: {hall.capacity}</p>
        <p style={{ margin: 0, fontSize: 14, fontWeight: "bold" }}>
          Cijena po satu: {convertPrice(hall.pricePerHour)}
        </p>

        <Link href={`/halls/${hall.id}`} style={{ marginTop: 6 }}>
          Detalji →
        </Link>
      </div>
    </div>
  );
}
