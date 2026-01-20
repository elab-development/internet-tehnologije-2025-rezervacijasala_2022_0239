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
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <h3>{hall.name}</h3>
      <p>Kapacitet: {hall.capacity}</p>
      <p>Cena: {hall.pricePerEvent} €</p>

      <Link href={`/halls/${hall.id}`}>Detalji</Link>
    </div>
  );
}
