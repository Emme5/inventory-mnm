"use client";

import { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button"; // มี CopyButton อยู่ด้วยเพิ่มในอนาคต
import { Item } from "@/types/type";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { ConfirmDialog } from "../ui/confirm-dialog";
import AddItemDrawer from "./AddItemDrawer";
import ItemEditDrawer from "./ItemEditDrawer";
import { Pencil, Trash } from "lucide-react";

export default function ItemTable() {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item " + id);
      return { success: true };
    },
    onSuccess: () => {
      toast.success(`ลบข้อมูลสำเร็จ ✅`);
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: () => {
      toast.error("เกิดข้อผิดพลาด ❌");
    },
  });

  const { data: queryItems = [], isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      header: "ชื่อสินค้า",
      cell: ({ row }) => <span>{row.original.name}</span>,
      filterFn: "includesString",
    },
    {
      id: "skuCategory",
      header: "SKU & Category",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="bg-purple-200 px-2 rounded">
            {row.original.sku ?? "-"}
          </span>
          <span className="text-gray-700 text-sm">
            {row.original.category?.name ?? "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Stock",
      cell: ({ row }) => <span>{row.original.quantity}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditItem(row.original)}
            className="flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteTarget(row.original)}
            className="flex items-center gap-1"
          >
            <Trash className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: queryItems,
    columns,
    state: { columnVisibility, globalFilter },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="ค้นหา..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-1/3"
        />

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">จัดการคอลัมน์</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {table.getAllLeafColumns().map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                >
                  {column.columnDef.header as string}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddItemDrawer />
        </div>
      </div>

      {/* Pagination ui */}
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          ก่อนหน้า
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          หน้าถัดไป
        </Button>
      </div>

      {/* Table */}
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
            <tr key={row.id} className="hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {editItem && (
        <ItemEditDrawer
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
          item={editItem}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="คุณแน่ใจหรือไม่?"
          description={`จะลบ "${deleteTarget.name}" ออกจากระบบถาวร!`}
          onConfirm={() => {
            deleteMutation.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
