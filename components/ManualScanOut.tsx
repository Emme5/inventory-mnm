"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ManualScanOut() {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleScanOut = async () => {
    if (!itemId || quantity <= 0) return;

    const res = await fetch(`/api/items/${itemId}/scanout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (res.ok) {
      toast.success("✅ ScanOut สำเร็จ");
      setItemId("");
      setQuantity(0);
    } else {
      toast.error("❌ เกิดข้อผิดพลาด โปรดใส่ข้อมูลให้ถูกต้อง");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="กรอก Items ID "
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="border rounded p-2 w-full"
      />
      <input
        type="number"
        placeholder="จำนวนที่จะเอาออก"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border rounded p-2 w-full"
      />
      <Button className="w-full bg-red-600 text-white" onClick={handleScanOut}>
        เอาของออก
      </Button>
    </div>
  );
}
