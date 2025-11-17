import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const movements = await prisma.stockMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // ปรับจำนวนตามที่ต้องการ
      include: { item: { select: { code: true, name: true } } },
    });

    return NextResponse.json(movements);
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json(
      { error: "Failed to fetch movements" },
      { status: 500 }
    );
  }
}
