import SignInForm from "@/components/auth/signin-form"; 

export default function LogInPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <section>
        <h1 className="text-2xl bg-blue-500 mb-4">Log In</h1>
        <SignInForm />
      </section>
    </main>
  );
}
