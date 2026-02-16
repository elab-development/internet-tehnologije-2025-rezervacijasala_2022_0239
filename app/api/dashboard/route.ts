import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();

    // Najpopularnije sale 
    const topHallsRaw = await prisma.reservation.groupBy({
      by: ['hallId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const popularHalls = await Promise.all(
      topHallsRaw.map(async (item) => {
        const hall = await prisma.hall.findUnique({
          where: { id: item.hallId },
          select: { name: true },
        });
        return { name: hall?.name || "Nepoznata", count: item._count.id };
      })
    );

    // Statistika po mesecima 
    const reservations = await prisma.reservation.findMany({
      where: {
        startDateTime: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
        status: { in: ['ACTIVE', 'COMPLETED'] },
      },
      include: {
        hall: { select: { pricePerHour: true } } 
      }
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Intl.DateTimeFormat('sr-RS', { month: 'short' }).format(new Date(currentYear, i)),
      count: 0,
      revenue: 0,
    }));

    reservations.forEach((res) => {
      const monthIndex = new Date(res.startDateTime).getMonth();
      

      const durationMs = new Date(res.endDateTime).getTime() - new Date(res.startDateTime).getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      
   
      const resRevenue = durationHours * (res.hall.pricePerHour || 0);

      monthlyData[monthIndex].count += 1;
      monthlyData[monthIndex].revenue += resRevenue;
    });

    return NextResponse.json({
      popularHalls,
      monthlyData,
    });
  } catch (error) {
    console.error("Greška:", error);
    return NextResponse.json({ error: "Neuspešno učitavanje podataka" }, { status: 500 });
  }
}