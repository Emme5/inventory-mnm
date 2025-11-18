"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CheckStock from "./CheckStock";
import { Item } from "@/types/type";

export default function AdjustStock() {
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleCountChange = (id: string, value: string) =>
    setCounts((prev) => ({ ...prev, [id]: Number(value) }));

  const handleNoteChange = (id: string, value: string) =>
    setNotes((prev) => ({ ...prev, [id]: value }));

  const handleSave = async (id: string) => {
    const payload = {
      itemId: id,
      actualCount: counts[id],
      note: notes[id],
    };

    await fetch("/api/checked", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setChecked((prev) => ({ ...prev, [id]: true }));
  };

  if (isLoading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <CheckStock
      items={items}
      counts={counts}
      notes={notes}
      checked={checked}
      onCountChange={handleCountChange}
      onNoteChange={handleNoteChange}
      onSave={handleSave}
    />
  );
}
