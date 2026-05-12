/**
 * INFRASTRUCTURE — NextAuth config
 *
 * NextAuth é "session transport" (cookie JWT). A lógica de auth real
 * vive em AuthenticateUseCase + EnvUserRepository.
 */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { AuthenticateUseCase } from "@/application/use-cases/authenticate";
import { EnvUserRepository } from "@/infrastructure/auth/user-repository";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Composição lazy — o repo lê env só quando o authorize roda,
// não no module load. Isso facilita dev local sem precisar do .env
// completo para só compilar.
function buildAuthenticate() {
  return new AuthenticateUseCase(new EnvUserRepository());
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await buildAuthenticate().execute(parsed.data);
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
