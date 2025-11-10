// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/db"; 

export async function GET() {
  // จำนวนรายการ
  const totalItems = await prisma.item.count();

  // คงเหลือ
  const remaining = await prisma.item.aggregate({
    _sum: { quantity: true },
  });

  // สแกนออก
  const scanOutTotal = await prisma.stockMovement.aggregate({
    _sum: { quantity: true },
    where: { type: "scanout" },
  });

  // สินค้าทั้งหมด (counter ที่ไม่ลดลง)
  const systemStats = await prisma.systemStats.findFirst();
  const totalCreated = systemStats?.totalCreated ?? 0;

  return NextResponse.json({
    totalCreated,
    totalItems,
    remaining: remaining._sum.quantity ?? 0,
    scanOut: scanOutTotal._sum.quantity ?? 0,
  });
}
