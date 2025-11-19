"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";

export function ManualScanOut() {
  const [code, setCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleScanOut = async () => {
    if ((!code && !barcode) || quantity <= 0) return;

    const res = await fetch(`/api/items/scanout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, barcode, quantity }),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(
        `มีการนำสินค้า ${data.name} ออกไป ${data.taken} ชิ้น (เหลือ ${data.remaining} ชิ้น)`
      );
      setCode("");
      setBarcode("");
      setQuantity(0);
    } else {
      const data = await res.json();

      if (data.error === "Item not found") {
        toast.error("❌ เกิดข้อผิดพลาด กรอก Code ID ผิด");
      } else if (data.error === "Not enough stock") {
        toast.error("❌ จำนวนที่ต้องการมากกว่าที่เหลืออยู่");
      } else if (data.error === "Out of stock") {
        toast.warning("⚠️ สินค้าชิ้นนี้เหลือ 0 แล้ว");
      } else {
        toast.error("❌ เกิดข้อผิดพลาด");
      }
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="กรอก Code, ID"
        value={code || barcode}
        onChange={(e) => {
          setCode(e.target.value);
          setBarcode(e.target.value);
        }}
        className="border rounded p-2 w-full"
      />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setQuantity((q) => Math.max(0, q - 1))}
        >
          <Minus className="w-4 h-4" />
        </Button>

        <input
          type="number"
          placeholder="จำนวนที่จะเอาออก"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded p-2 w-full text-center"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setQuantity((q) => q + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <Button className="w-full bg-red-600 text-white" onClick={handleScanOut}>
        เอาของออก
      </Button>
    </div>
  );
}
