import ItemTable from "@/components/items/ItemTable";

export default function items() {
  return (
    <div>
      <h1 className="text-xl font-semibold">รายการ</h1>
      <p className="text-sm text-gray-500 mb-4">
        Manage your products, Category.
      </p>
      <ItemTable />
    </div>
  );
}

