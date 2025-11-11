// /app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET() {
  console.log("API /notifications called"); // ✅ log ต้นทาง

  const { data, error } = await supabase
    .from("StockMovement")
    .select("id, type, quantity, createdAt, Item(name)")
    .order("createdAt", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }

  console.log("Supabase data:", data); // ✅ log ข้อมูลที่ได้
  return NextResponse.json([
    {
      id: "test-id",
      type: "out",
      quantity: 3,
      createdAt: new Date().toISOString(),
      Item: { name: "สินค้า A" },
    },
  ]);
}
