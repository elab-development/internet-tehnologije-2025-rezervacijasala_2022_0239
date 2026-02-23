import { PrismaClient, ReservationStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
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

  const dorisHash = await bcrypt.hash("123456", 10);
  const adminHash = await bcrypt.hash("123456!", 10);
  const markoHash = await bcrypt.hash("123456!", 10);

  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      firstName: "Doris",
      lastName: "Smulja",
      email: "doris@gmail.com",
      passwordHash: dorisHash,
      roleId: 2,
      createdAt: new Date("2026-01-01T10:00:00.000Z"),
    },
  });

  await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      firstName: "Luka",
      lastName: "Hristov",
      email: "luka@gmail.com",
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
      firstName: "Jovan",
      lastName: "Teofilovic",
      email: "jovan@gmail.com",
      passwordHash: markoHash,
      roleId: 1,
      createdAt: new Date("2026-01-01T10:10:00.000Z"),
    },
  });

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


  const halls = [
    {
      id: 1,
      name: "Glavna sala",
      description: "Standardna sala za venčanja i veće proslave.",
      capacity: 250,
      pricePerHour: 100,
      isActive: true,
      hasStage: true,
      isClosed: true,
      cityId: 1,
      categoryId: 1,
      imageUrl: "/images/halls/glavna.jpg",
    },
    {
      id: 2,
      name: "Roze sala",
      description: "Moderna i šik sala sa roze detaljima.",
      capacity: 200,
      pricePerHour: 79,
      isActive: true,
      hasStage: true,
      isClosed: true,
      cityId: 2,
      categoryId: 1,
      imageUrl: "/images/halls/roze.jpg",
    },
    {
      id: 3,
      name: "Romantična sala",
      description: "Ako ste oduvek zamišljali romantičan ambijent.",
      capacity: 150,
      pricePerHour: 90,
      isActive: true,
      hasStage: true,
      isClosed: false,
      cityId: 4,
      categoryId: 1,
      imageUrl: "/images/halls/romanticna.jpg",
    },
    {
      id: 4,
      name: "Biznis 101",
      description: "Konferencijska sala, idealna za sastanke i prezentacije.",
      capacity: 80,
      pricePerHour: 28,
      isActive: true,
      hasStage: true,
      isClosed: true,
      cityId: 1,
      categoryId: 3,
      imageUrl: "/images/halls/poslovna.jpg",
    },
    {
      id: 5,
      name: "Sreća",
      description: "Sala za naše mališane i porodična okupljanja.",
      capacity: 50,
      pricePerHour: 30,
      isActive: true,
      hasStage: false,
      isClosed: true,
      cityId: 2,
      categoryId: 2, // Ispravljeno na DEČIJA (id 2)
      imageUrl: "/images/halls/sreca.jpg",
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
        imageUrl: h.imageUrl,
      },
      create: h,
    });
  }

  console.log("Seed završen.");
  console.log("Login kredencijali:");
  console.log("MANAGER: doris@gmail.com / 123456");
  console.log("ADMIN:   luka@gmail.com / 123456!");
  console.log("USER:    jovan@gmail.com / 123456!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
