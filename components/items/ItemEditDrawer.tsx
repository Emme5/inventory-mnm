"use client";

import { ItemFormValues } from "../schemas/ItemForm";
import { ItemForm } from "./ItemForm";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

type ItemEditDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemFormValues | null;
};

export default function ItemEditDrawer({
  open,
  onOpenChange,
  item,
}: ItemEditDrawerProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: ItemFormValues) => {
      const id = values.id ?? values.code;
      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update item");
      return res.json();
    },
    onSuccess: () => {
      toast.success("แก้ไขข้อมูลสำเร็จ ✅");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("แก้ไขไม่สำเร็จ ❌");
    },
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>แก้ไขสินค้า</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 overflow-y-auto h-full">
          <ItemForm
            initialValues={item}
            onSave={(values) => mutation.mutate(values)}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
