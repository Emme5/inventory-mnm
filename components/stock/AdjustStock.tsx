"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Item } from "@/types/type";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import CheckStock from "./CheckLayout";
import ItemCheckForm from "./ItemCheckForm";

export default function AdjustStock() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  const { data: checkedItems = [], isLoading: isCheckedLoading } = useQuery<
    { itemId: string }[],
    Error
  >({
    queryKey: ["checked"],
    queryFn: async () => {
      const res = await fetch("/api/checked");
      if (!res.ok) throw new Error("Failed to fetch checked items");
      return res.json();
    },
  });

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: {
      itemId: string;
      actualCount: number;
      note?: string;
    }) => {
      const res = await fetch("/api/checked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save check");
      return res.json();
    },
    onSuccess: () => {
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ["checked"] });
    },
  });

  const handleOpenDrawer = (item: Item) => {
    setSelectedItem(item);
  };

  if (isLoading || isCheckedLoading) return <p>กำลังโหลดข้อมูล...</p>;

  const checkedMap: Record<string, boolean> = {};
  checkedItems.forEach((entry) => {
    checkedMap[entry.itemId] = true;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">ปรับปรุงสต็อกสินค้า</h2>

      <CheckStock
        items={items}
        counts={counts}
        checked={checkedMap}
        onOpenDrawer={handleOpenDrawer}
      />

      <Drawer
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>ตรวจเช็คสินค้า</DrawerTitle>
          </DrawerHeader>
          {selectedItem && (
            <ItemCheckForm
              item={selectedItem}
              actualCount={counts[selectedItem.id] ?? 0}
              note={notes[selectedItem.id] ?? ""}
              onCountChange={(val) =>
                setCounts((prev) => ({ ...prev, [selectedItem.id]: val }))
              }
              onNoteChange={(val) =>
                setNotes((prev) => ({ ...prev, [selectedItem.id]: val }))
              }
              onSave={() =>
                mutation.mutate({
                  itemId: selectedItem.id,
                  actualCount: counts[selectedItem.id] ?? 0,
                  note: notes[selectedItem.id],
                })
              }
            />
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
