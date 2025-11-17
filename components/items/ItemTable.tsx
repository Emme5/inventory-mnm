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
import { Button, CopyButton } from "../ui/button";
import { Item } from "@/types/type";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/context-menu";
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

export function ItemTable() {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const queryClient = useQueryClient();
  const [deleteTargets, setDeleteTargets] = useState<Item[]>([]);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete item " + id);
      }
      return { success: true };
    },
    onSuccess: (_, ids) => {
      toast.success(`ลบข้อมูลสำเร็จ ✅ (${ids.length} รายการ)`);
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
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: "code",
      header: "ID",
      cell: ({ row }) => <span>{row.original.code}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "barcode",
      header: "BarCode",
      cell: ({ row }) => {
        const barcode = row.original.barcode ?? "";
        return (
          <div className="flex items-center gap-2">
            <span>
              {barcode.length > 12 ? barcode.slice(0, 12) + "..." : barcode}
            </span>
            <CopyButton value={row.original.barcode} />
          </div>
        );
      },
      filterFn: "includesString",
    },
    { accessorKey: "name", header: "ชื่อสินค้า", filterFn: "includesString" },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <button onClick={column.getToggleSortingHandler()}>
          จำนวน{" "}
          {column.getIsSorted() === "asc"
            ? "↑"
            : column.getIsSorted() === "desc"
            ? "↓"
            : "⇅"}
        </button>
      ),
      filterFn: "includesString",
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
                  {column.id}
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
            <ContextMenu key={row.id}>
              <ContextMenuTrigger asChild>
                <tr className="hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border px-3 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {/* คลิกขวาแล้วลบ พร้อมเงื่อนไขเมื่อลบหลายรายการ */}
                {table.getSelectedRowModel().rows.length > 1 ? (
                  <ContextMenuItem
                    className="text-red-600"
                    onClick={() =>
                      setDeleteTargets(
                        table.getSelectedRowModel().rows.map((r) => r.original)
                      )
                    }
                  >
                    Delete Selected
                  </ContextMenuItem>
                ) : (
                  <ContextMenuItem
                    className="text-red-600"
                    onClick={() => setDeleteTargets([row.original])}
                  >
                    Delete
                  </ContextMenuItem>
                )}

                <ContextMenuItem
                  className="text-gray-600"
                  onClick={() => setEditItem(row.original)}
                >
                  Preview
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setEditItem(row.original)}>
                  Edit
                </ContextMenuItem>
              </ContextMenuContent>

              {/* Alert Modal */}
              {deleteTargets.length > 0 && (
                <ConfirmDialog
                  open={deleteTargets.length > 0}
                  onOpenChange={(open) => !open && setDeleteTargets([])}
                  title="คุณแน่ใจหรือไม่?"
                  description={`จะลบ ${deleteTargets.length} รายการออกจากระบบถาวร!`}
                  onConfirm={() => {
                    deleteMutation.mutate(deleteTargets.map((item) => item.id));
                    setDeleteTargets([]);
                  }}
                />
              )}
            </ContextMenu>
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

      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {table.getSelectedRowModel().rows.length} of{" "}
          {table.getRowModel().rows.length} row(s) selected.
        </span>
      </div>
    </div>
  );
}
