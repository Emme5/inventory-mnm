import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    // บันทึกลง DB (ใช้ create หรือ update เผื่อเครื่องเดิมสมัครซ้ำ)

    await prisma.pushSubscriber.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      },
      create: {
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}