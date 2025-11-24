"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import ItemForm from "./ItemForm";
import { ItemFormValues } from "../schemas/zodForm";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddItemDrawer() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: ItemFormValues) => {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save item");
      return res.json();
    },
    onSuccess: () => {
      toast.success("บันทึกข้อมูลสำเร็จ ✅");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("เกิดข้อผิดพลาด ❌ BarCode หรือ SKU ซ้ำกัน");
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-black text-white">
        + Add Item
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>เพิ่มสินค้าใหม่</DrawerTitle>
          </DrawerHeader>

          <div className="p-2 overflow-y-auto h-full">
            <ItemForm
              onSave={(values) => mutation.mutate(values)}
              onCancel={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
