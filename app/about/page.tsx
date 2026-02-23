export default function AboutPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <section className="card">
        <h1>Restoran Ljubičica</h1>
        <p style={{ fontSize: 18 }}>
         Naš restoran je nastao kao mesto za okupljanje, slavlje i posebne trenutke. Tokom godina razvijali smo se zajedno sa našim gostima, negujući toplu atmosferu, gostoprimstvo i pažnju prema detaljima. Naše sale su prilagođene različitim vrstama događaja – od manjih porodičnih proslava do većih svečanosti i poslovnih okupljanja. Cilj ove aplikacije je da vam omogući brzu i jednostavnu rezervaciju sala, kako biste bez dodatnih poziva mogli da isplanirate svoj događaj.
      </p>
      </section>

      <section
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div className="card">
          <h2>Kontakt</h2>
          <p>
            Telefon: +381 66 873 2890 <br />
            Email: ljubicica@gmail.com <br />
            Adresa: Belgrade, Serbia
          </p>
        </div>

        <div className="card">
          <h2>Lokacija</h2>
          <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-color)" }}>
            <iframe
              title="Google map"
              src="https://maps.google.com/maps?q=Belgrade&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
