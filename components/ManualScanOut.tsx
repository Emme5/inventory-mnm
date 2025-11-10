"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ManualScanOut() {
  const [itemId, setItemId] = useState("")
  const [quantity, setQuantity] = useState(0)

  const handleScanOut = async () => {
    if (!itemId || quantity <= 0) return

    const res = await fetch(`/api/items/${itemId}/scanout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    })

    if (res.ok) {
      alert("✅ ScanOut สำเร็จ")
      setItemId("")
      setQuantity(0)
    } else {
      alert("❌ เกิดข้อผิดพลาด")
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="กรอก ID หรือชื่อสินค้า"
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
  )
}
