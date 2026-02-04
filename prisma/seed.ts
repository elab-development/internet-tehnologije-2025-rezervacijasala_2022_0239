import { PrismaClient, ReservationStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- 1) ROLE (ID 1/2/3 kao na slici) ---
  await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "USER" },
  });
  await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: "MANAGER" },
  });
  await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, name: "ADMIN" },
  });

  // --- 2) USERS (ne komplikujemo: generišemo hash iz lozinke) ---
  // Lozinke (da se možeš ulogovati posle reset-a):
  // Doris:  Doris123!
  // Luka:   Admin123!
  // Marko:  Marko123!
  const dorisHash = await bcrypt.hash("Doris123!", 10);
  const adminHash = await bcrypt.hash("Admin123!", 10);
  const markoHash = await bcrypt.hash("Marko123!", 10);

  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      firstName: "Doris",
      lastName: "Smuljic",
      email: "doris@gmail.com",
      passwordHash: dorisHash,
      roleId: 1,
      createdAt: new Date("2026-01-01T10:00:00.000Z"),
    },
  });

  await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      firstName: "Luka",
      lastName: "Hristovic",
      email: "admin@gm.com",
      passwordHash: adminHash,
      roleId: 3,
      createdAt: new Date("2026-01-01T10:05:00.000Z"),
    },
  });

  await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      firstName: "Marko",
      lastName: "Jovic",
      email: "marko@gmail.com",
      passwordHash: markoHash,
      roleId: 1,
      createdAt: new Date("2026-01-01T10:10:00.000Z"),
    },
  });

  // --- 3) HALL CATEGORY (1:1) ---
  await prisma.hallCategory.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "VENČANA" },
  });
  await prisma.hallCategory.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: "DEČIJA" },
  });
  await prisma.hallCategory.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, name: "POSLOVNA" },
  });
  await prisma.hallCategory.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, name: "ROĐENDANSKA" },
  });

  // --- 4) CITY (1:1) ---
  await Promise.all([
    prisma.city.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: "Beograd" },
    }),
    prisma.city.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: "Novi Sad" },
    }),
    prisma.city.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: "Novi Pazar" },
    }),
    prisma.city.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, name: "Niš" },
    }),
    prisma.city.upsert({
      where: { id: 5 },
      update: {},
      create: { id: 5, name: "Valjevo" },
    }),
  ]);

  // --- 5) HALLS (OVO TI JE NAJBITNIJE: 1:1 po slici) ---
  // Napomena: opisi su “što sličniji” jer na slici su skraćeni (…),
  // ali polja (ID/cityId/categoryId/capacity/price/flags) su 1:1 kako si prikazala.
  const halls = [
    {
      id: 1,
      name: "Mala sala",
      description: "Ova sala je slatka.",
      capacity: 50,
      pricePerHour: 30,
      isActive: true,
      hasStage: false,
      isClosed: true,
      cityId: 3, // Novi Pazar
      categoryId: 4, // ROĐENDANSKA
    },
    {
      id: 2,
      name: "LUX",
      description: "Naša najekskluzivnija sala.",
      capacity: 100,
      pricePerHour: 60,
      isActive: true,
      hasStage: true,
      isClosed: true,
      cityId: 1, // Beograd
      categoryId: 4, // ROĐENDANSKA
    },
    {
      id: 3,
      name: "Glavna sala",
      description: "Standardna sala za venčanja i veće proslave.",
      capacity: 250,
      pricePerHour: 100,
      isActive: true,
      hasStage: true,
      isClosed: true,
      cityId: 1, // Beograd
      categoryId: 1, // VENČANA
    },
    {
      id: 4,
      name: "Roze sala",
      description: "Moderna i šik sala sa roze detaljima.",
      capacity: 200,
      pricePerHour: 79,
      isActive: true,
      hasStage: true,
      isClosed: true,
      cityId: 2, // Novi Sad
      categoryId: 1, // VENČANA
    },
    {
      id: 5,
      name: "Romantična sala",
      description: "Ako ste oduvek zamišljali romantičan ambijent.",
      capacity: 150,
      pricePerHour: 90,
      isActive: true,
      hasStage: true,
      isClosed: false,
      cityId: 4, // Niš
      categoryId: 1, // VENČANA
    },
    {
      id: 6,
      name: "Biznis 101",
      description: "Konferencijska sala, idealna za sastanke i prezentacije.",
      capacity: 80,
      pricePerHour: 28,
      isActive: true,
      hasStage: true,
      isClosed: true,
      cityId: 1, // Beograd
      categoryId: 3, // POSLOVNA
    },
    {
      id: 7,
      name: "Sreća",
      description: "Sala za naše mališane i porodična okupljanja.",
      capacity: 50,
      pricePerHour: 30,
      isActive: true,
      hasStage: false,
      isClosed: true,
      cityId: 2, // Novi Sad
      categoryId: 3, // POSLOVNA (po tvojoj slici)
    },
  ];

  for (const h of halls) {
    await prisma.hall.upsert({
      where: { id: h.id },
      update: {
        name: h.name,
        description: h.description,
        capacity: h.capacity,
        pricePerHour: h.pricePerHour,
        isActive: h.isActive,
        hasStage: h.hasStage,
        isClosed: h.isClosed,
        cityId: h.cityId,
        categoryId: h.categoryId,
      },
      create: h,
    });
  }

  // --- 6) RESERVATIONS (da liči na tvoje test podatke, ali nije kritično) ---
  // Ako hoćeš 1:1 i za rezervacije — možemo kasnije dotegnuti do poslednjeg detalja.
  await prisma.reservation.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      userId: 1,
      hallId: 1,
      startDateTime: new Date("2026-04-08T06:00:00.000Z"),
      endDateTime: new Date("2026-04-08T08:00:00.000Z"),
      numberOfGuests: 1,
      status: ReservationStatus.ACTIVE,
      createdAt: new Date("2026-01-27T10:16:24.299Z"),
    },
  });

  await prisma.reservation.upsert({
    where: { id: 8 },
    update: {},
    create: {
      id: 8,
      userId: 3,
      hallId: 5,
      startDateTime: new Date("2026-02-15T18:00:00.000Z"),
      endDateTime: new Date("2026-02-15T23:00:00.000Z"),
      numberOfGuests: 80,
      status: ReservationStatus.CANCELLED,
      createdAt: new Date("2026-01-30T16:44:28.525Z"),
    },
  });

  await prisma.reservation.upsert({
    where: { id: 9 },
    update: {},
    create: {
      id: 9,
      userId: 3,
      hallId: 6,
      startDateTime: new Date("2026-04-23T06:00:00.000Z"),
      endDateTime: new Date("2026-04-23T08:00:00.000Z"),
      numberOfGuests: 1,
      status: ReservationStatus.CANCELLED,
      createdAt: new Date("2026-01-30T17:13:49.581Z"),
    },
  });

  console.log("✅ Seed završen.");
  console.log("➡️ Login kredencijali nakon reset-a:");
  console.log("USER:  doris@gmail.com / Doris123!");
  console.log("ADMIN: admin@gm.com / Admin123!");
  console.log("USER:  marko@gmail.com / Marko123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
