import { prisma } from "@/utils/db";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ ต้อง await ก่อน
  if (!id) {
    return <p className="text-red-500">ไม่พบรหัสสินค้า</p>;
  }

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      movements: { orderBy: { createdAt: "desc" }, take: 10 },
      checks: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!item) {
    return <p className="text-red-500">ไม่พบสินค้าในระบบ</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">รายละเอียดสินค้า</h1>
      <p>
        <strong>ชื่อสินค้า:</strong> {item.name}
      </p>
      <p>
        <strong>รหัสสินค้า:</strong> {item.code}
      </p>
      <p>
        <strong>Barcode:</strong> {item.barcode ?? "-"}
      </p>
      <p>
        <strong>จำนวนในระบบ:</strong> {item.quantity}
      </p>
    </div>
  );
}
