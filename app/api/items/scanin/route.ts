import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { sendPushNotification } from "@/utils/notification";

export async function POST(req: Request) {
  const { id, quantity, note } = await req.json();

  // หา item เดิมก่อน
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // อัปเดตจำนวนสินค้า (บวกเพิ่ม)
  const updated = await prisma.item.update({
    where: { id },
    data: { quantity: item.quantity + quantity },
  });

  // บันทึก movement
  const movement = await prisma.stockMovement.create({
    data: { itemId: item.id, type: "in", quantity, note },
  });

  // ส่ง notification
  sendPushNotification(
    "📦 รับสินค้าเข้าใหม่!",
    `${updated.name} เพิ่มเข้ามา ${quantity} ชิ้น (รวม ${updated.quantity})`
  );

  return NextResponse.json({
    name: updated.name,
    added: quantity,
    total: updated.quantity,
    movement,
  });
}