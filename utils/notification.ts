import webpush from "web-push";
import { prisma } from "@/utils/db";

// ตั้งค่า web-push ครั้งเดียวที่นี่ (ถ้ายังไม่มีการตั้งค่าที่อื่น)
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || "mailto:suphamanee81@gmail.com",
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
    );

// ฟังก์ชันสำหรับส่งแจ้งเตือนไปหาทุกคน
export async function sendPushNotification(title: string, body: string) {
  try {
    // 1. ดึงรายชื่อคนรับแจ้งเตือนทั้งหมดจาก DB
    const subscribers = await prisma.pushSubscriber.findMany();

    if (subscribers.length === 0) return; // ไม่มีคนรับก็จบ

    const notificationPayload = JSON.stringify({ title, body });

    // 2. วนลูปส่งแจ้งเตือน (ใช้ Promise.all เพื่อให้ทำงานพร้อมกัน)
    const promises = subscribers.map((sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: { auth: sub.auth, p256dh: sub.p256dh },
      };

      return webpush
        .sendNotification(pushConfig, notificationPayload)
        .catch((err) => {
          console.error(`Error sending push to ${sub.id}:`, err);
          // ถ้าส่งไม่ผ่านเพราะ User ยกเลิกหรือลบแอป (410 Gone, 404 Not Found) ให้ลบออกจาก DB
          if (err.statusCode === 410 || err.statusCode === 404) {
            return prisma.pushSubscriber.delete({ where: { id: sub.id } });
          }
        });
    });

    await Promise.all(promises);
    console.log(`Sent notification: "${title}" to ${subscribers.length} devices.`);
    
  } catch (error) {
    console.error("Error in sendPushNotification:", error);
    // ไม่ throw error เพื่อไม่ให้กระทบการทำงานหลัก
  }
}