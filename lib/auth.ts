import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        // MOCK: เปลี่ยน logic นี้เป็นตรวจ DB จริงเมื่อพร้อม
        if (email === "test@example.com" && password === "123456") {
          return { id: "1", name: "Test User", email };
        }

        // ถ้าไม่ผ่าน return null
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // หรือ process.env.AUTH_SECRET ใน v5
  session: {
    strategy: "jwt",
  },
  // สามารถเพิ่ม callbacks เพื่อแนบข้อมูลเพิ่มใน token/session
  // callbacks: {
  //   async jwt({ token, user }) { if (user) token.role = "user"; return token; },
  //   async session({ session, token }) { session.user.role = token.role as string; return session; },
  // },
};
