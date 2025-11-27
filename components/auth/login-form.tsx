"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Loader2, LogIn, Package2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // จำลองการ Login (แทนที่ด้วย code จริงของคุณ)
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) throw new Error("Login failed");

      await new Promise((resolve) => setTimeout(resolve, 1500)); // จำลอง delay

      toast.success("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับกลับครับ 🎉");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto grid w-[350px] gap-6 border-none shadow-none lg:w-[400px]">
      <CardHeader className="grid gap-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Package2 className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">Login</CardTitle>
        <CardDescription className="text-balance text-muted-foreground">
          กรอกอีเมลของคุณด้านล่างเพื่อเข้าสู่ระบบจัดการสต็อก
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-primary"
              >
                ลืมรหัสผ่าน?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> เข้าสู่ระบบ
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="mt-4 text-center text-sm w-full text-muted-foreground">
          ยังไม่มีบัญชี?{" "}
          <a href="#" className="underline hover:text-primary">
            ติดต่อ Admin
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
