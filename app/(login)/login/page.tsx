import LogInForm from "@/components/login/login-form"; 

export default function LogInPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <section className="mt-16">
        <LogInForm />
      </section>
    </main>
  );
}
