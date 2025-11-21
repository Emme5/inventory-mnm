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
import { itemSchema, ItemFormValues } from "../schemas/ItemForm";
import { Scan } from "lucide-react";

const QrScan = dynamic(() => import("@/components/camera/QrScan"), {
  ssr: false,
});

type ItemFormProps = {
  initialValues?: ItemFormValues | null;
  onSave: (values: ItemFormValues) => void;
  onCancel: () => void;
};

export default function ItemForm({
  initialValues,
  onSave,
  onCancel,
}: ItemFormProps) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: initialValues ?? {
      code: "",
      barcode: "",
      name: "",
      quantity: 0,
      image: null,
    },
  });

  const [showScanner, setShowScanner] = useState(false);

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
              quantity: 0,
              image: null,
            }
          );
        })}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        {/* ID */}
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
        />

        {/* Code + Scan */}
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code (Barcode)</FormLabel>
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

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อสินค้า</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>จำนวน</FormLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
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
          <Button type="submit" className="flex-1">
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
