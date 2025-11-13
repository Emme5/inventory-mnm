import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function POST(req: Request) {
  const { code, barcode, quantity } = await req.json();

  const item = await prisma.item.findFirst({
    where: {
      OR: [{ code: code ?? "" }, { barcode: barcode ?? "" }],
    },
  });

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
    where: { id: item.id },
    data: { quantity: item.quantity - quantity },
  });

  // บันทึก movement
  const movement = await prisma.stockMovement.create({
    data: { itemId: item.id, type: "out", quantity },
  });

  return NextResponse.json({
    name: updated.name,
    taken: quantity,
    remaining: updated.quantity,
    movement,
  });
}
