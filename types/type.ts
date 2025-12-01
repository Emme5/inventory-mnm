// ใช้สำหรับ API responses และ types ต่างๆ
export type Item = {
  id: string;
  code: string;
  sku?: string;
  barcode: string;
  name: string;
  quantity: number;
  minStock?: number;
  categoryId?: string | null;
  category?: Category | null;
  imageUrl?: string | null;
};

// ใช้สำหรับหมวดหมู่สินค้า
export type Category = {
  id: string;
  name: string;
};

// ใช้สำหรับประวัติการเคลื่อนไหว
export type ApiMovement = {
  id: string;
  type: "in" | "out" | "adjust";
  quantity: number;
  createdAt: string;
  note?: string;
  item: {
    code: string;
    name: string;
  };
};

// รวม Item + Movements
export type ItemWithMovements = Item & { movements: ApiMovement[] };

// ใช้สำหรับตัวเลือกสินค้าใน dropdowns หรือการค้นหา
export type ProductOption = {
  id: string;
  name: string;
  quantity: number;
};

// ใช้สำหรับ dashboard stats
export type Stats = {
  totalCreated: number;
  totalItems: number;
  remaining: number;
  scanOut: number;
};

// ใช้สำหรับ notification
export type Notification = {
  id: string;
  message: string;
  icon?: React.ReactNode;
  createdAt: Date;
};