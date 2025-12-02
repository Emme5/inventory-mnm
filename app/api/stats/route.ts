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
    where: { type: "out" },
  });

  const scanInTotal = await prisma.stockMovement.aggregate({
    _sum: { quantity: true },
    where: { type: "in" }, // หรือ "scanIn" ตามที่คุณบันทึกจริง
  });

  return NextResponse.json({
    totalReceived: scanInTotal._sum.quantity ?? 0,
    totalItems,
    remaining: remaining._sum.quantity ?? 0,
    scanOut: scanOutTotal._sum.quantity ?? 0,
  });
}
