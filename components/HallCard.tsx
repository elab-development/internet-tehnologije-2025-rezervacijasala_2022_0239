import Link from "next/link";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  pricePerHour: number;
  city?: { name: string };
  category?: { name: string };
};

export default function HallCard({ hall }: { hall: Hall }) {
  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: 16,
        overflow: "hidden",
        background: "var(--card-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img
        src={`/images/halls/${hall.id}.jpg`}
        alt={hall.name}
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
        <p style={{ margin: 0, fontSize: 14 }}>Cijena po satu: {hall.pricePerHour} €</p>

        <Link href={`/halls/${hall.id}`} style={{ marginTop: 6 }}>
          Detalji →
        </Link>
      </div>
    </div>
  );
}
