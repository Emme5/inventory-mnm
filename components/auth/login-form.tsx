"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const onGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true, // NextAuth จะจัดการ redirect เอง
      });
      // ไม่ต้องเช็ค res หรือทำ window.location.href อีก
    } catch (error) {
      console.error(error);
      toast.error("เข้าสู่ระบบด้วย Google ไม่สำเร็จ");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={onGoogleSignIn}
        disabled={loading}
        className="w-full bg-blue-600 text-white text-2xl p-8 rounded hover:bg-blue-700"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย Google"}
      </Button>
    </div>
  );
}
