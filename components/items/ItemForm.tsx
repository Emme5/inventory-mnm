"use client";

import { useState } from "react";
import { FileUpload } from "../ui/FileUpload";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemSchema, ItemFormValues } from "../schemas/zodForm";
import { Scan } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import AddCategory from "./AddCategory";

const QrScan = dynamic(() => import("@/components/camera/QrScan"), {
  ssr: false,
});

type ItemFormProps = {
  initialValues?: ItemFormValues | null;
  onSave: (values: ItemFormValues) => void;
  onCancel: () => void;
  hideQuantity?: boolean
};

export default function ItemForm({
  initialValues,
  onSave,
  onCancel,
  hideQuantity = false,
}: ItemFormProps) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: initialValues ?? {
      code: "",
      barcode: "",
      name: "",
      sku: "",
      categoryId: "",
      quantity: 0,
      minStock: 2,
      image: null,
    },
  });

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json() as Promise<{ id: string; name: string }[]>;
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSave(values);
          form.reset(
            initialValues ?? {
              code: "",
              barcode: "",
              name: "",
              sku: "",
              categoryId: "",
              quantity: 0,
              minStock: 2,
              image: null,
            }
          );
        })}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        {/* ID  ส่วนนี้ต้องการที่จะไม่ให้แสดงผลลัพธ์กำลังพิจารณา
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <Input
                {...field}
                readOnly
                className="bg-gray-100 text-gray-500"
              />
            </FormItem>
          )}
        /> */}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>ชื่อสินค้า</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SKU + Category */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <Input {...field} value={field.value ?? ""} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <div className="flex items-center gap-2">
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setShowAddCategory(true)}
                  >
                    + เพิ่ม
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <AddCategory
            open={showAddCategory}
            onOpenChange={setShowAddCategory}
          />
        </div>

        {/* Initial Stock + Min Stock Alert */}
        <div className="grid grid-cols-2 gap-4">
            {!hideQuantity && (
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Stock</FormLabel>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
           )}
          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Stock Alert</FormLabel>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Barcode (span 2 columns) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Barcode</FormLabel>
                <div className="flex gap-2">
                  <Input {...field} />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowScanner((p) => !p)}
                  >
                    <Scan size={20} />
                  </Button>
                </div>
                {showScanner && (
                  <div className="mt-3">
                    <QrScan
                      onResult={(value: string) => {
                        form.setValue("barcode", value);
                        setShowScanner(false);
                      }}
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload กำลังพิจารณา */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>เพิ่มรูป</FormLabel>
              <FileUpload
                onFileSelect={(file) => form.setValue("image", file)}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 w-full">
          <Button type="submit" className="flex-1 bg-gray-800 text-white">
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
