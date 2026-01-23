import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      
      <section
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 18,
          alignItems: "center",
        }}
      >
        <div>
          <span className="badge">Rezervacije online</span>
          <h1 style={{ marginTop: 10 }}>
            Rezerviši salu bez poziva i čekanja
          </h1>
          <p style={{ marginTop: 10, fontSize: 18 }}>
            Dobrodošli u naš restoran. Preko aplikacije možeš brzo rezervisati
            jednu od naših sala, pratiti aktivne rezervacije i istoriju — sve na
            jednom mestu.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <Link
              href="/halls"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 14,
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                color: "white",
                boxShadow: "0 14px 30px rgba(139, 47, 35, 0.25)",
              }}
            >
              Pogledaj sale
            </Link>

            <Link
              href="/about"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 14,
                fontWeight: 700,
                border: "1px solid var(--border-color)",
                background: "rgba(255,255,255,0.6)",
              }}
            >
              O restoranu
            </Link>
          </div>
        </div>

        {/* slika*/}
        <img
          src="/images/restaurant/logo.png"
          alt="Naš restoran"
          style={{
            width: "100%",
            height: 280,
            objectFit: "cover",
            borderRadius: 18,
            border: "1px solid var(--border-color)",
          }}
        />
      </section>

      {/* osobine */}
      <section style={{ marginTop: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Detaljan pregled</h3>
            <p>Možeš da vidiš sve informacije i slike našeg restorana i sala</p>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Brza rezervacija</h3>
            <p>Odaberi salu, datum i broj zvanica — i to je to.</p>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Praćenje rezervacija</h3>
            <p>Na jednom mestu vidi aktivne i prethodne rezervacije.</p>
          </div>

        </div>
      </section>
    </main>
  );
}
