import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function POST(req: Request) {
  const { code, quantity } = await req.json();

  const item = await prisma.item.findUnique({ where: { code } });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (item.quantity < quantity) {
    return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
  }

  if (item.quantity === 0) {
    return NextResponse.json({ error: "Out of stock" }, { status: 400 });
  }

  const updated = await prisma.item.update({
    where: { code },
    data: { quantity: item.quantity - quantity },
  });

  // บันทึก movement
  await prisma.stockMovement.create({
    data: { itemId: item.id, type: "out", quantity },
  });

  return NextResponse.json(updated);
}
