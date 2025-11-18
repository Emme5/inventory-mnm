import ItemTable from "@/components/items/ItemTable";
import React from "react";

const items = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">รายการ</h1>
      <ItemTable />
    </div>
  );
};

export default items;
