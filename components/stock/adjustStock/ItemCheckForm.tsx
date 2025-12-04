import { AdjustmentReason, Item } from "@/types/type";
import { Button } from "@/components/ui/button";

type ItemCheckFormProps = {
  item: Item;
  actualCount: number;
  note: string;
  reason: AdjustmentReason;
  onCountChange: (value: number) => void;
  onNoteChange: (value: string) => void;
  onReasonChange: (value: AdjustmentReason) => void;
  onSave: () => void;
};

export default function ItemCheckForm({
  item,
  actualCount,
  note,
  reason,
  onCountChange,
  onNoteChange,
  onReasonChange,
  onSave,
}: ItemCheckFormProps) {
  const diff = actualCount - item.quantity;

  const handleSave = () => {
    onSave();
  };

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="rounded-lg p-6 w-full max-w-md space-y-6 shadow-sm">
        <div className="bg-gray-100 space-y-2 text-center p-4 rounded-2xl">
          <p>
            <strong>รหัสสินค้า (SKU):</strong> {item.sku}
          </p>
          <p>
            <strong>ชื่อสินค้า:</strong> {item.name}
          </p>
          <p>
            <strong>ยอดในระบบปัจจุบัน:</strong> {item.quantity} ชิ้น
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ยอดที่นับได้จริง (Physical Count)
            </label>
            <input
              type="number"
              value={actualCount}
              onChange={(e) => onCountChange(Number(e.target.value))}
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="กรอกจำนวนที่นับได้จริง"
            />
            <p className="text-xs text-gray-500 mt-1">
              ยอดในระบบ: {item.quantity} ชิ้น
            </p>
          </div>

          {/* Difference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ผลต่าง
            </label>
            <p className="text-xs text-gray-500">
              {diff > 0 ? (
                <span className="text-green-600">+{diff}</span>
              ) : diff < 0 ? (
                <span className="text-red-600">{diff}</span>
              ) : (
                <span className="text-gray-600">0</span>
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              สาเหตุการปรับปรุง
            </label>
            <select
              value={reason}
              onChange={(e) => onReasonChange(e.target.value as AdjustmentReason)}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="cycle_count">ตรวจนับประจำรอบ (Cycle Count)</option>
              <option value="received">รับสินค้าเข้า (Received)</option>
              <option value="damaged">สินค้าชำรุด/เสียหาย (Damaged)</option>
              <option value="lost">สินค้าสูญหาย (Lost)</option>
              <option value="return">รับคืน (Return)</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              หมายเหตุ
            </label>
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              rows={3}
              placeholder="กรอกหมายเหตุเพิ่มเติม"
            />
          </div>
        </div>

        <div>
          <Button
            onClick={handleSave}
            className="w-full bg-gray-800 text-white"
          >
            บันทึก
          </Button>
        </div>
      </div>
    </div>
  );
}
