"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("คุณไม่อนุญาตให้แจ้งเตือน");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      setIsSubscribed(true);
      toast.success("เปิดแจ้งเตือนเรียบร้อย! 🔔");
    } catch (error) {
      console.error("❌ Subscription error:",error);
      toast.error("เกิดข้อผิดพลาดในการสมัคร");
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await fetch("/api/subscribe", {
          method: "DELETE",
          body: JSON.stringify(subscription),
          headers: { "Content-Type": "application/json" },
        });
      }

      setIsSubscribed(false);
      toast.error("ปิดแจ้งเตือนเรียบร้อย ❌");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการยกเลิก");
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) return null;

  const togglePush = () => {
    if (isSubscribed) {
      unsubscribeFromPush();
    } else {
      subscribeToPush();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isSubscribed}
          onChange={togglePush}
          disabled={loading}
          className="sr-only"
        />
        <div
          className={`w-12 h-6 rounded-full transition ${
            isSubscribed ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
              isSubscribed ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      </label>
      <span>{isSubscribed ? "ON" : "OFF"}</span>
    </div>
  );
}
