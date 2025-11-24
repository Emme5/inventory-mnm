import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  try {
    // หา item เดิมก่อน
    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // ถ้า barcode เปลี่ยน → เช็คว่ามีใครใช้ barcode นี้แล้วหรือยัง
    if (body.barcode && body.barcode !== existingItem.barcode) {
      const duplicate = await prisma.item.findUnique({
        where: { barcode: body.barcode },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "Barcode already exists" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.item.update({
      where: { id },
      data: {
        sku: body.sku ?? null,
        barcode: body.barcode,
        name: body.name,
        quantity: body.quantity,
        minStock: body.minStock ?? existingItem.minStock ?? 2,
        imageUrl: body.imageUrl ?? null,
        categoryId: body.categoryId ?? null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update item", detail: String(error) },
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
    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.stockCheck.deleteMany({ where: { itemId: id } });
    await prisma.stockMovement.deleteMany({ where: { itemId: id } });

    const deleted = await prisma.item.delete({ where: { id } });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete item", detail: String(error) },
      { status: 500 }
    );
  }
}
