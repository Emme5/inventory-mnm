import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { sendPushNotification } from "@/utils/notification";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.barcode) {
      const existing = await prisma.item.findUnique({
        where: { barcode: body.barcode },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Barcode already exists" },
          { status: 400 }
        );
      }
    }

    const lastItem = await prisma.item.findFirst({
      where: { code: { startsWith: "SMH-" } },
      orderBy: { code: "desc" },
    });

    const extractNumber = (code?: string) => {
      const match = code?.match(/^SMH-(\d{1,})$/);
      return match ? parseInt(match[1], 10) : 0;
    };

    const nextNumber = extractNumber(lastItem?.code) + 1;
    const SystemCode = `SMH-${String(nextNumber).padStart(4, "0")}`;

    const item = await prisma.item.create({
      data: {
        code: SystemCode,
        sku: body.sku ?? null,
        barcode: body.barcode,
        name: body.name,
        quantity: body.quantity,
        imageUrl: typeof body.image === "string" ? body.image : null,
        categoryId: body.categoryId || null,
      },
      include: {
        category: true,
      },
    });

    await prisma.stockMovement.create({
      data: {
        type: "in",
        quantity: body.quantity,
        itemId: item.id,
      },
    });

    sendPushNotification(
      "📦 รับสินค้าเข้าใหม่!",
      `เพิ่ม "${item.name}" จำนวน ${item.quantity} ชิ้น เข้าสู่ระบบ`
    );

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const items = await prisma.item.findMany({
    include: {
      category: true,
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(items);
}
