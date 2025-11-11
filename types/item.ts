export type Item = {
  id: string
  code: string
  name: string
  quantity: number
  imageUrl?: string | null
}

// ใช้สำหรับประวัติการเคลื่อนไหว
export type Movement = {
  id: number
  item: string
  type: "in" | "out"
  quantity: number
  date: string
}

// รวม Item + Movements
export type ItemWithMovements = Item & {
  movements: Movement[]
}

// ใช้สำหรับ dashboard stats
export type Stats = {
  totalCreated: number
  totalItems: number
  remaining: number
  scanOut: number
}

// ใช้สำหรับ notification
export type Notification = {
  id: string
  message: string
  icon?: React.ReactNode
  createdAt: Date
}