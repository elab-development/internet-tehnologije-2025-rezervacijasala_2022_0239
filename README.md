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
- **Swagger** (`swagger-jsdoc`, `swagger-ui-react`, `swagger-ui-express`)

---

## Struktura projekta

```
.
├── app/                # Next.js App Router + API rute (app/api/**)
├── components/         # UI komponente
├── lib/                # Shared util (npr. prisma client)
├── prisma/             # schema, migrations, seed
├── public/             # statički fajlovi
├── .env                # environment varijable (ne commitovati)
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
- **MySQL** (lokalno ili Docker)
- **npm**

---

## Podešavanje okruženja (.env)

Kreiraj `.env` fajl u root-u projekta.

### Minimalno (Prisma + MySQL)
```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
```

Primer za lokalni MySQL:
```bash
DATABASE_URL="mysql://root:root@localhost:3306/rezervacija_sala"
```

---

## Pokretanje aplikacije

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

## Prisma korisne komande

```bash
npx prisma studio           # UI za bazu
npx prisma db pull          # povlačenje šeme iz postojeće baze
npx prisma migrate reset    # reset baze (briše podatke)
```

---

## Docker (MySQL)

Docker fajlovi (`docker-compose.yml`) će biti dodati naknadno. Kad budu dostupni, ovde će biti dokumentovano:
- `docker compose up -d` (pokretanje baze)
- podešavanje `DATABASE_URL` (localhost vs db)
- `docker compose down` (gašenje)

---

## License
Private / School project.