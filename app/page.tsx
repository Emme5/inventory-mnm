import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="space-y-6 text-center">
        {/* กลุ่มปุ่ม */}
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            Go to Login
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          >
            Dashboard
          </Link>
        </div>

        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>
            Success! Welcome to Stock\Inventory Management
          </AlertTitle>
          <AlertDescription>
            Alerts & reporting for low stock, slow-moving items, or excess
            inventory.
          </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
