import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    return Response.json({
      content: "This is protected content. You are signed in.",
      user: session.user,
    });
  }

  return Response.json({ error: "You must be signed in" }, { status: 401 });
}
