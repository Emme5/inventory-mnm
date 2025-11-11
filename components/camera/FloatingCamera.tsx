"use client";
import { useState } from "react";
import { RiCameraLine } from "@remixicon/react";
import { QrScan } from "./QrScan";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Item } from "@/types/type";

export function FloatingCamera() {
  const [open, setOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const [scanOutQty, setScanOutQty] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 my-16"
      >
        <RiCameraLine size={24} />
      </button>

      {/* Camera Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan สินค้า</DialogTitle>
          </DialogHeader>

          {!scannedItem ? (
            <QrScan
              onResult={(code: string) => {
                // TODO: fetch item จาก DB ตาม barcode
                fetch(`/api/items/${code}`)
                  .then((res) => res.json())
                  .then((item) => {
                    setScannedItem(item);
                    setScanOutQty(0);
                  });
              }}
            />
          ) : (
            <div className="space-y-4">
              <p>
                <strong>ชื่อสินค้า:</strong> {scannedItem.name}
              </p>
              <p>
                <strong>จำนวนคงเหลือ:</strong> {scannedItem.quantity}
              </p>

              {/* Scan Out Control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setScanOutQty((q) => Math.max(0, q - 1))}
                >
                  -
                </Button>
                <span>{scanOutQty}</span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setScanOutQty((q) => (q < scannedItem.quantity ? q + 1 : q))
                  }
                >
                  +
                </Button>
              </div>

              {/* Confirm Scan Out */}
              <Button
                className="w-full bg-red-600 text-white"
                onClick={() => {
                  if (scannedItem.quantity === 0) {
                    setShowWarning(true);
                  } else {
                    fetch(`/api/items/${scannedItem.id}/scanout`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ quantity: scanOutQty }),
                    });
                  }
                }}
              >
                Scan Out
              </Button>

              {showWarning && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded text-yellow-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span>Stock ไม่ตรง กรุณา Adjust</span>
                  </div>
                  <Button
                    className="mt-2 bg-yellow-500 text-white hover:bg-yellow-600"
                    onClick={() =>
                      (window.location.href = "/dashboard/stock/check")
                    }
                  >
                    ไปหน้า Check
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
