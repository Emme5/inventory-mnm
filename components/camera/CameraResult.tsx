"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QrScan from "./QrScan";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Item } from "@/types/type";

export default function CameraResult({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const [scanOutQty, setScanOutQty] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
      setScannedItem(null);
      setScanOutQty(0);
      setShowWarning(false);
    }, 0);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Start Scan</DialogTitle>
            </DialogHeader>

            {!scannedItem ? (
              <QrScan
                onResult={(code: string) => {
                  fetch(`/api/items`)
                    .then((res) => {
                      if (!res.ok) throw new Error("Failed to fetch items");
                      return res.json();
                    })
                    .then((items) => {
                      const found = items.find(
                        (item: Item) =>
                          item.code === code || item.barcode === code
                      );
                      if (found) {
                        setScannedItem(found);
                        setScanOutQty(0);
                      } else {
                        setScannedItem({
                          name: "ไม่พบสินค้าในระบบ",
                          quantity: 0,
                        } as Item);
                      }
                    })
                    .catch((err) => {
                      console.error("Scan error:", err);
                    });
                }}
              />
            ) : (
              <>
                <p>
                  <strong>ชื่อสินค้า:</strong> {scannedItem.name}
                </p>
                <p>
                  <strong>จำนวนคงเหลือ:</strong> {scannedItem.quantity}
                </p>

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
                      setScanOutQty((q) =>
                        q < scannedItem.quantity ? q + 1 : q
                      )
                    }
                  >
                    +
                  </Button>
                </div>

                <Button
                  className="w-full bg-red-600 text-white"
                  onClick={() => {
                    if (scannedItem.quantity === 0) {
                      setShowWarning(true);
                    } else {
                      fetch(`/api/items/scanout`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          code: scannedItem.code,
                          quantity: scanOutQty,
                        }),
                      });
                    }
                  }}
                >
                  Scan Out
                </Button>

                {showWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded text-yellow-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <span>Stock ไม่ตรงกรุณา Adjust</span>
                    </div>
                    <Button
                      className="mt-2 bg-yellow-500 text-white hover:bg-yellow-600"
                      onClick={() =>
                        (window.location.href = "/dashboard/stock/check")
                      }
                    >
                      ไปหน้า Check
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
