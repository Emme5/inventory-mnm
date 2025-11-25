import { Item } from "@/types/type";
import { Button } from "@/components/ui/button"; 

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

  const diff = actualCount - item.quantity;

 const handleSave = () => {
    onSave();
  };

  return (
    <div className="space-y-4 p-6 text-sm">
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
          value={actualCount}
          onChange={(e) => onCountChange(Number(e.target.value))}
          className="ml-2 w-24 border rounded px-2 py-3"
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
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="ml-2 w-full border rounded px-2 py-6"
        />
      </div>
      <div className="pt-2">
        <Button
          onClick={handleSave}
          className="w-full"
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
}
