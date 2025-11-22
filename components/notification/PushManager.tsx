"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Bell, BellOff } from "lucide-react";

// ฟังก์ชันแปลง Key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true); // บอกว่าเครื่องนี้รองรับนะ

      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) setIsSubscribed(true);
        });
      });
    }
  }, []);

  const subscribeToPush = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });

        // ส่งไปเก็บที่ Server
        await fetch("/api/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: { "Content-Type": "application/json" },
        });

        setIsSubscribed(true);
        toast.success("เปิดแจ้งเตือนเรียบร้อย! 🔔");
      } else {
        toast.error("คุณไม่อนุญาตให้แจ้งเตือน");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการสมัคร");
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={subscribeToPush}
      disabled={isSubscribed || loading}
      title={isSubscribed ? "แจ้งเตือนเปิดอยู่" : "เปิดการแจ้งเตือน"}
    >
      {isSubscribed ? (
        <Bell className="text-green-600" size={20} />
      ) : (
        <BellOff className="text-gray-400" size={20} />
      )}
    </Button>
  );
}
