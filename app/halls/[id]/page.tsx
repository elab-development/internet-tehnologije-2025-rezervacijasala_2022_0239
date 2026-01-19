import ReserveForm from "./ReserveForm";
import Link from "next/link";

const halls = [
  { id: 1, name: "Velika svečana sala", capacity: 300, pricePerHour: 120 },
  { id: 2, name: "Mala sala", capacity: 80, pricePerHour: 60 },
  { id: 3, name: "VIP sala", capacity: 150, pricePerHour: 100 },
];

export default async function HallDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ OVO JE KLJUČ

  const hall = halls.find((h) => String(h.id) === id);

  if (!hall) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Sala nije pronađena</h1>
        <p>Traženi ID: {id}</p>
        <Link href="/halls">Nazad na sale</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>{hall.name}</h1>
      <p>Kapacitet: {hall.capacity}</p>
      <p>Cijena: {hall.pricePerHour} €/sat</p>

      <hr style={{ margin: "24px 0" }} />

      <h2>Rezerviši ovu salu</h2>
      <ReserveForm hallId={hall.id} />
    </main>
  );
}
