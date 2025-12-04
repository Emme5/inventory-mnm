"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ProductOption } from "@/types/type";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StockControl() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<ProductOption | null>(null);
  const [actionType, setActionType] = useState<"in" | "out">("in");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const isIn = actionType === "in"; // สำหรับการสลับปุ่มเพิ่ม/ลด สต็อก และเปลี่ยนสี

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items", search],
    queryFn: async () => {
      const res = await fetch(
        `/api/items?search=${encodeURIComponent(search)}`
      );
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json() as Promise<ProductOption[]>;
    },
  });

  // ✅ ฟังก์ชันกด Confirm
  const handleConfirm = async () => {
    if (!productId) {
      toast.info("กรุณาเลือกสินค้า");
      return;
    }

    setLoading(true);
    try {
      if (isIn) {
        // Stock IN
        const promise = fetch("/api/items/scanin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId, quantity, note }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Stock IN failed");
          return data;
        });

        toast.promise(promise, {
          loading: "กำลังเพิ่มสินค้า...",
          success: (data) =>
            `เพิ่มสินค้า ${data.name} จำนวน ${data.added} ชิ้น (รวม ${data.total})`,
          error: (err) => `ผิดพลาด: ${err.message}`,
        });
      } else {
        // Stock OUT
        const promise = fetch("/api/items/scanout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: selectedItem?.name, quantity, note }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Stock OUT failed");
          return data;
        });

        toast.promise(promise, {
          loading: "กำลังนำสินค้าออก...",
          success: (data) =>
            `นำออก ${data.name} จำนวน ${data.taken} ชิ้น (เหลือ ${data.remaining})`,
          error: (err) => `ผิดพลาด: ${err.message}`,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">Update Stock</h2>

      {/* Select Product */}
      <div className="space-y-2">
        <label className="font-medium">Select Product</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
              
            >
              {selectedItem?.name ?? "-- Select Product --"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput
                placeholder="ค้นหาสินค้า..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                {isLoading ? (
                  <div className="p-2 text-gray-500">Loading...</div>
                ) : (
                  items.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        setSelectedItem(item);
                        setProductId(item.id);
                        setSearch("");
                        setOpen(false);
                      }}
                    >
                      {item.name}
                    </CommandItem>
                  ))
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Action Type */}
      <div className="space-y-2">
        <label className="font-medium">Action Type</label>
        <div className="flex overflow-hidden rounded-lg border">
          <Button
            variant="ghost"
            className={`flex-1 rounded-none rounded-l-lg ${
              isIn ? "bg-green-600 text-white" : "bg-white text-gray-800"
            }`}
            onClick={() => setActionType("in")}
          >
            ↓ Stock IN
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none rounded-r-lg ${
              !isIn ? "bg-red-600 text-white" : "bg-white text-gray-800"
            }`}
            onClick={() => setActionType("out")}
          >
            ↑ Stock OUT
          </Button>
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <label className="font-medium">Quantity</label>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      {/* Reference / Note */}
      <div className="space-y-2">
        <label className="font-medium">Reference / Note</label>
        <Input
          placeholder="e.g. PO-123 or Broken Item"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Confirm Button */}
      <Button
        className={`w-full ${isIn ? "bg-green-600" : "bg-red-600"} text-white`}
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isIn ? "Confirm Receive" : "Confirm Issue"}
      </Button>
    </div>
  );
}
