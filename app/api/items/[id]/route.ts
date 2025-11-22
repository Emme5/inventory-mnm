import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  try {
    const updated = await prisma.item.update({
      where: { id },
      data: {
        code: body.code,
        barcode: body.barcode,
        name: body.name,
        quantity: body.quantity,
        imageUrl: body.imageUrl,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log("DELETE id:", id);

  try {
    await prisma.stockCheck.deleteMany({
      where: { itemId: id },
    });

    await prisma.stockMovement.deleteMany({
      where: { itemId: id },
    });

    const deleted = await prisma.item.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete item", detail: String(error) },
      { status: 500 }
    );
  }
}
