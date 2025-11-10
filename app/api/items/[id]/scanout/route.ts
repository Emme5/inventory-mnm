import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { quantity } = await req.json();

  // ดึงสินค้าจาก DB
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // ตรวจสอบจำนวน
  if (item.quantity < quantity) {
    return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
  }

  // อัปเดตจำนวน
  const updated = await prisma.item.update({
    where: { id },
    data: { quantity: item.quantity - quantity },
  });

  return NextResponse.json(updated);
}
