"use client";

import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data
type Item = {
  id: string;
  code: string;
  name: string;
  quantity: number;
};

const data: Item[] = [
  { id: "SMH-0001", code: "123456", name: "สินค้า A", quantity: 10 },
  { id: "SMH-0002", code: "789012", name: "สินค้า B", quantity: 5 },
];

export function ItemTable() {
  const columns: ColumnDef<Item>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "ชื่อสินค้า" },
    { accessorKey: "quantity", header: "จำนวน" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link href={`/dashboard/items/${item.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/dashboard/items/add">
          <Button>+ Add Item</Button>
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-200 rounded-md">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-3 py-2 text-left">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
