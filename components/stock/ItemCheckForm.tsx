"use client";

import { useState } from "react";
import { Item } from "@/types/type";

type ItemCheckFormProps = {
  item: Item;
  actualCount: number;
  note: string;
  onCountChange: (value: number) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
};

export default function ItemCheckForm({
  item,
  actualCount,
  note,
  onCountChange,
  onNoteChange,
  onSave,
}: ItemCheckFormProps) {
  const [localCount, setLocalCount] = useState(actualCount);
  const [localNote, setLocalNote] = useState(note);

  const diff = localCount - item.quantity;

  const handleSave = () => {
    // sync กลับไป parent //adjuststock
    onCountChange(localCount);
    onNoteChange(localNote);
    onSave();
  };

  return (
    <div className="space-y-4 p-4 text-sm">
      <div>
        <strong>ชื่อสินค้า:</strong> {item.name}
      </div>
      <div>
        <strong>Barcode:</strong> {item.barcode}
      </div>
      <div>
        <strong>สต็อกในระบบ:</strong> {item.quantity}
      </div>
      <div>
        <strong>จำนวนที่นับจริง:</strong>
        <input
          type="number"
          value={localCount}
          onChange={(e) => setLocalCount(Number(e.target.value))}
          className="ml-2 w-24 border rounded px-2 py-1"
        />
      </div>
      <div>
        <strong>ผลต่าง:</strong>{" "}
        {diff > 0 ? (
          <span className="text-green-600">+{diff}</span>
        ) : diff < 0 ? (
          <span className="text-red-600">{diff}</span>
        ) : (
          <span className="text-gray-600">0</span>
        )}
      </div>
      <div>
        <strong>หมายเหตุ:</strong>
        <input
          type="text"
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          placeholder="เหตุผล..."
          className="ml-2 w-full border rounded px-2 py-1"
        />
      </div>
      <div className="pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}
