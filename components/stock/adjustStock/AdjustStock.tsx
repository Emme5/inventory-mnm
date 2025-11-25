"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Item } from "@/types/type";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ItemCheckForm from "./ItemCheckForm";
import CheckLayout from "./CheckLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type CheckedEntry = {
  itemId: string;
  actualCount: number;
  note?: string;
  createdAt: string;
};
export default function AdjustStock() {
  const queryClient = useQueryClient();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const { data: items = [], isLoading } = useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  const { data: checkedItems = [], isLoading: isCheckedLoading } = useQuery<
    CheckedEntry[],
    Error
  >({
    queryKey: ["checked"],
    queryFn: async () => {
      const res = await fetch("/api/checked");
      if (!res.ok) throw new Error("Failed to fetch checked items");
      return res.json();
    },
  });

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
      return res.json(); // API ควรคืน { itemId, actualCount, note, createdAt }
    },
    onSuccess: () => {
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ["checked"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("บันทึกการตรวจเช็คเรียบร้อยแล้ว ✅"); // ✅ Toast แจ้งเตือน
    },
  });

  const handleOpenDrawer = (item: Item) => {
    setSelectedItem(item);
  };

  const handleOpenDetail = (item: Item) => {
    setDetailItem(item);
  };

  const checkedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    checkedItems.forEach((e) => {
      map[e.itemId] = true;
    });
    return map;
  }, [checkedItems]);

  const checkedDetailMap = useMemo(() => {
    const map: Record<string, CheckedEntry> = {};
    checkedItems.forEach((e) => {
      map[e.itemId] = e;
    });
    return map;
  }, [checkedItems]);

  if (isLoading || isCheckedLoading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">ปรับปรุงสต็อกสินค้า</h2>

      <CheckLayout
        items={items}
        details={checkedDetailMap}
        checked={checkedMap}
        onOpenDrawer={handleOpenDrawer}
        onOpenDetail={handleOpenDetail}
      />

      <Dialog
        open={!!detailItem}
        onOpenChange={(open) => !open && setDetailItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>รายละเอียดการเช็คสินค้า</DialogTitle>
          </DialogHeader>
          {detailItem &&
            (() => {
              const detail = checkedDetailMap[detailItem.id];
              return detail ? (
                <div className="space-y-4 text-sm">
                  <p>
                    <strong>ชื่อสินค้า:</strong> {detailItem.name}
                  </p>
                  <p>
                    <strong>Barcode:</strong> {detailItem.barcode}
                  </p>
                  <p>
                    <strong>จำนวนในระบบ:</strong> {detailItem.quantity}
                  </p>
                  <p>
                    <strong>จำนวนที่นับจริง:</strong> {detail.actualCount}
                  </p>
                  <p>
                    <strong>หมายเหตุ:</strong> {detail.note ?? "-"}
                  </p>
                  <p>
                    <strong>วันที่เช็ค:</strong>{" "}
                    {new Date(detail.createdAt).toLocaleString("th-TH")}
                  </p>
                </div>
              ) : (
                <p>ไม่พบข้อมูลการเช็คจากระบบ</p>
              );
            })()}
        </DialogContent>
      </Dialog>

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
