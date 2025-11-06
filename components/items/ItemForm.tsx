"use client";
//master List
import { useState } from "react";
import { RiQrCodeLine } from "@remixicon/react";
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { itemSchema, ItemFormValues } from "../schemas/ItemForm"

const QrScan = dynamic(
  () => import("@/components/camera/QrScan").then((mod) => mod.QrScan),
  {
    ssr: false,
  }
);

export function ItemForm() {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      id: "SMH-0001",
      code: "",
      name: "",
      quantity: 0,
      image: null,
    },
  });

  const [showScanner, setShowScanner] = useState(false);

  function onSubmit(values: ItemFormValues) {
    console.log("Form Data:", values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow"
      >
        {/* ID */}
        <FormField
          control={form.control}
          name="id"
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code (Barcode)</FormLabel>
              <div className="flex gap-2">
                <Input {...field} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowScanner((prev) => !prev)}
                >
                  <RiQrCodeLine size={20} />
                </Button>
              </div>
              {showScanner && (
                <div className="mt-3">
                  <QrScan
                    onResult={(value: string) => {
                      form.setValue("code", value);
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
              <Input type="number" {...field} />
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

        {/* Save Button */}
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
