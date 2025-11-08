import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const item = await prisma.item.create({
      data: {
        code: body.code,
        name: body.name,
        quantity: body.quantity,
        imageUrl: typeof body.image === "string" ? body.image : null,
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

