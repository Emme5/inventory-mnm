"use client";

import { useState } from "react";
import { RiQrCodeLine } from "@remixicon/react";
import { FileUpload } from "../ui/FileUpload";
import { Button } from "../ui/button";

// แนะนำ lib สำหรับสแกน barcode/QR ใน PWA:
// - react-barcode-scanner (เบา ใช้ BarcodeDetector API) https://www.npmjs.com/package/react-barcode-scanner
// - scanbot-web-sdk (enterprise, รองรับ PWA เต็ม) https://scanbot.io
// - strich.io (อีกตัวเลือก modern)
// ตอนนี้เราจะ mock ไว้ก่อน

export function ItemForm() {
  const [form, setForm] = useState({
    id: "SMH-0001", // auto-generate
    code: "",
    name: "",
    quantity: 0,
    image: null as File | null,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleScan() {
    // TODO: integrate barcode scanner lib
    alert("เปิดกล้องสแกน (mock)");
    setForm((prev) => ({ ...prev, code: "1234567890123" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form Data:", form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow"
    >
      {/* ID */}
      <div>
        <label className="block text-sm font-medium mb-1">ID</label>
        <input
          type="text"
          name="id"
          value={form.id}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
        />
      </div>

      {/* Code + Scan */}
      <div>
        <label className="block text-sm font-medium mb-1">Code (Barcode)</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="button"
            onClick={handleScan}
            className="p-2 border rounded bg-gray-50 hover:bg-gray-100"
          >
            <RiQrCodeLine size={20} />
          </button>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">ชื่อสินค้า</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium mb-1">จำนวน</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">เพิ่มรูป</label>
        <FileUpload onFileSelect={(file) => setForm({ ...form, image: file })} />
      </div>

      {/* Save Button */}
      <Button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save
      </Button>
    </form>
  );
}
