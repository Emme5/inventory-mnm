export type Item = {
  id: string;
  code: string;
  barcode: string;
  name: string;
  quantity: number;
  imageUrl?: string | null;
};

// ใช้สำหรับประวัติการเคลื่อนไหว
export type ApiMovement = {
  id: string;
  type: "in" | "out" | "adjust";
  quantity: number;
  createdAt: string;
  item: {
    code: string;
    name: string;
  };
};

// รวม Item + Movements
export type ItemWithMovements = Item & {
  movements: ApiMovement[];
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
