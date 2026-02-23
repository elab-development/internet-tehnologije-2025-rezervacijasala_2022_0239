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
├── app/ # Next.js App Router + API rute (app/api/**)
├── components/ # UI komponente
├── lib/ # Shared util (npr. prisma client)
├── prisma/ # schema, migrations, seed
├── public/ # statički fajlovi
├── .env # environment varijable (ne commitovati)
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── package.json

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

## Pokretanje aplikacije

1) Instalacija paketa:
```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

Aplikacija radi na: http://localhost:3000