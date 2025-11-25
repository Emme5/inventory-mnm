import ItemTable from "@/components/items/ItemTable";

const items = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">รายการ</h1>
      <p className="text-sm text-gray-500 mb-6">Manage your products, Category, and initial stock.</p>
      <ItemTable />
    </div>
  );
};

export default items;
