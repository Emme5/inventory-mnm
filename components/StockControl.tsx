"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export default function StockControl() {
  const [actionType, setActionType] = useState<"in" | "out">("in");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const isIn = actionType === "in";

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">Update Stock</h2>

      {/* Select Product */}
      <div className="space-y-2">
        <label className="font-medium">Select Product</label>
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger>
            <SelectValue placeholder="-- Choose Product --" />
          </SelectTrigger>
          <SelectContent>
            {/* ตัวอย่างสินค้า */}
            <SelectItem value="p1">สินค้า A</SelectItem>
            <SelectItem value="p2">สินค้า B</SelectItem>
          </SelectContent>
        </Select>
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
        onClick={() => {
          // TODO: handle submit
          console.log({ productId, actionType, quantity, note });
        }}
      >
        {isIn ? "Confirm Receive" : "Confirm Issue"}
      </Button>
    </div>
  );
}
