import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, actualCount, note } = body;

    // ดึงข้อมูลสต็อกในระบบ
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const difference = actualCount - item.quantity;

    // บันทึกผลตรวจเช็ค
    const check = await prisma.stockCheck.create({
      data: {
        itemId,
        actualCount,
        difference,
        note,
        checked: true,
      },
    });

    await prisma.stockMovement.create({
      data: {
        itemId,
        type: "adjust",        // ประเภทการเคลื่อนไหว
        quantity: actualCount, // จำนวนที่นับจริง
      },
    });

    return NextResponse.json(check);
  } catch (error) {
    console.error("Error saving stock check:", error);
    return NextResponse.json(
      { error: "Failed to save check" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const checks = await prisma.stockCheck.findMany({
    where: { checked: true },
    select: {
      itemId: true,
      actualCount: true,
      note: true,
      createdAt: true,
    },
  });

  return NextResponse.json(checks);
}
