"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemSchema, ItemFormValues } from "../schemas/ItemForm";
import { Input } from "../ui/input";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Scan } from "lucide-react";

const QrScan = dynamic(
  () => import("@/components/camera/QrScan").then((mod) => mod.QrScan),
  {
    ssr: false,
  }
);

type ItemEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemFormValues | null;
  onSave: (values: ItemFormValues) => void;
};

export function ItemEditDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: ItemEditDialogProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: item ?? {
      id: "",
      code: "",
      name: "",
      quantity: 0,
      image: null,
    },
  });

  const [showScanner, setShowScanner] = useState(false);

  React.useEffect(() => {
    if (item) {
      form.reset(item);
      setIsEditing(false);
    }
  }, [item, form]);

  const handleSubmit = (values: ItemFormValues) => {
    onSave(values);
    onOpenChange(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "แก้ไขสินค้า" : "รายละเอียดสินค้า"}
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          // ✅ โหมดแก้ไข
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <div className="flex gap-2">
                      <Input {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowScanner((prev) => !prev)}
                      >
                        <Scan size={20} />
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

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          // โหมดดูรายละเอียด
          <div className="space-y-2">
            <p>
              <strong>Code:</strong> {item.code}
            </p>
            <p>
              <strong>ชื่อสินค้า:</strong> {item.name}
            </p>
            <p>
              <strong>จำนวน:</strong> {item.quantity}
            </p>
          </div>
        )}

        {/* ปุ่ม Edit จะอยู่เสมอที่ Footer เมื่อยังไม่อยู่ในโหมดแก้ไข */}
        {!isEditing && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">ปิด</Button>
            </DialogClose>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
