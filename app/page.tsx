import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
        Go to Login
      </Link>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Dashboard
      </Link>
    </main>
  );
}
