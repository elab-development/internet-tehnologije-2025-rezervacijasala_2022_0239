import Link from "next/link";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  pricePerEvent: number;
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
      {/* IMAGE */}
      <img
        src={`/images/halls/${hall.id}.jpg`}
        alt={hall.name}
        style={{
          width: "100%",
          height: 160,
          objectFit: "cover",
        }}
      />

      {/* CONTENT */}
      <div style={{ padding: 14, display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0 }}>{hall.name}</h3>
        <p style={{ margin: 0, fontSize: 14 }}>
          Kapacitet: {hall.capacity}
        </p>
        <p style={{ margin: 0, fontSize: 14 }}>
          Cijena: {hall.pricePerEvent} €
        </p>

        <Link href={`/halls/${hall.id}`} style={{ marginTop: 6 }}>
          Detalji →
        </Link>
      </div>
    </div>
  );
}
