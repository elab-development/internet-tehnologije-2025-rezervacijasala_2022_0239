# Rezervacija sala

Web aplikacija za **pretragu i rezervaciju sala**, razvijena u **Next.js (App Router)** + **React** uz **Prisma ORM** i **MySQL** bazu podataka.

---

## Tech Stack
- **Next.js** `^16.1.6` (App Router)
- **React** `19.2.3`
- **TypeScript**
- **Prisma** `^6.19.2` + **MySQL**
- **TailwindCSS** `^4` + PostCSS
- **bcrypt** (hash lozinki)
- **next-cloudinary** (rad sa slikama)
- **resend** (slanje emailova)
- **Swagger / OpenAPI** (`swagger-jsdoc`, `swagger-ui-react`, `swagger-ui-express`)

---

## Struktura projekta

```
.
├── app/                 # Next.js App Router + API rute (app/api/**)
├── components/          # UI komponente
├── lib/                 # Shared util (npr. prisma client)
├── prisma/              # schema, migrations, seed
├── public/              # statički fajlovi
├── docker-compose.yml   # Docker compose (MySQL + app)
├── Dockerfile           # Docker build za Next app
├── .env                 # environment varijable (ne commitovati)
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

> `.next/` i `node_modules/` su generisani i ne treba da se commituju.

---

## Preduslovi (Prerequisites)
- **Node.js** 18+ (preporuka)
- **npm**
- **MySQL** (lokalno ili Docker)

---

## Podešavanje okruženja (.env)

Kreiraj `.env` fajl u root-u projekta (ne commitovati).

```bash
# MySQL / Prisma (LOCAL - kada pokrećeš aplikaciju preko npm run dev)
DATABASE_URL="mysql://root:root@localhost:3306/rezervacija_sala"

# Kursna lista
EXCHANGERATE_API_KEY="..."

# Email (Resend)
RESEND_API_KEY="..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_SECRET="..."
```

---

## Pokretanje aplikacije (Local)

1) Instalacija paketa:
```bash
npm install
```

2) Prisma generate:
```bash
npx prisma generate
```

3) Migracije (development):
```bash
npx prisma migrate dev
```

4) (Opcionalno) Seed:
```bash
npx prisma db seed
```

5) Start dev server:
```bash
npm run dev
```

Aplikacija radi na: http://localhost:3000

---

## Swagger / API dokumentacija

- Swagger UI: `http://localhost:3000/swagger`
- OpenAPI JSON: `http://localhost:3000/api/swagger`

---

## Prisma korisne komande

```bash
npx prisma studio           # UI za bazu
npx prisma db pull          # povlačenje šeme iz postojeće baze
npx prisma migrate reset    # reset baze (briše podatke)
```

---

## Docker

U projektu već postoje Docker fajlovi (`docker-compose.yml` i `Dockerfile`).

### Opcija A (preporučeno): samo MySQL u Docker-u, aplikacija lokalno

1) Pokreni bazu:
```bash
docker compose up -d db
```

2) U `.env` koristi localhost konekciju (jer app radi na host-u):
```bash
DATABASE_URL="mysql://root:root@localhost:3306/rezervacija_sala"
```

3) Migracije + start aplikacije:
```bash
npx prisma migrate dev
npm run dev
```

Gašenje:
```bash
docker compose down
```

---

### Opcija B: aplikacija + MySQL u Docker-u (app + db)

1) Pokretanje:
```bash
docker compose up --build
```

Aplikacija radi na: http://localhost:3000

2) Gašenje:
```bash
docker compose down
```

Brisanje i podataka iz baze (volume):
```bash
docker compose down -v
```

> U Docker režimu aplikacija koristi DB hostname `db` (unutar docker network-a).
> U `docker-compose.yml` baza je postavljena na **rezervacije_sala**, pa je i `DATABASE_URL` u compose-u:
> `mysql://root:root@db:3306/rezervacije_sala`.

---

## Troubleshooting

### Prisma error P2021 (table does not exist)
Najčešće znači da migracije nisu odrađene na bazi:
```bash
npx prisma migrate dev
```

### Port već zauzet
Podrazumevani portovi:
- App: **3000**
- MySQL: **3306**

Ugasiti procese koji koriste port ili promeniti port mapping u `docker-compose.yml`.

---

## License
Private / School project.
