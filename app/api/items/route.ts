import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
        barcode: body.barcode,
        name: body.name,
        quantity: body.quantity,
        imageUrl: typeof body.image === "string" ? body.image : null,
      },
    });

    await prisma.stockMovement.create({
      data: {
        type: "in",
        quantity: body.quantity,
        itemId: item.id,
      },
    });

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
  const items = await prisma.item.findMany();
  return NextResponse.json(items);
}
