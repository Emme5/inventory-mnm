import { z } from "zod";

export const itemSchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  sku: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  barcode: z.string().min(1, "ต้องกรอก Code"),
  name: z.string().min(1, "ต้องกรอกชื่อสินค้า"),
  quantity: z.number().min(1, "จำนวนต้องมากกว่า 0"),
  minStock: z.number().optional(),
  image: z.instanceof(File).nullable().optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
