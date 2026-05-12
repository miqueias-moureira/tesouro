/**
 * INFRASTRUCTURE — UserRepository (env-based)
 *
 * MVP-friendly: usuário e senha vivem em variáveis de ambiente.
 * Para trocar, basta editar no painel da Vercel e redeploy.
 *
 * Para v2 (multi-user, persistência), trocar por adapter Postgres
 * implementando a mesma interface UserRepository.
 */

import type { UserRepository } from "@/application/ports";
import type { Credentials, User } from "@/domain/auth/types";

export class EnvUserRepository implements UserRepository {
  private readonly email: string;
  private readonly password: string;
  private readonly name: string;

  constructor() {
    const email = process.env.AUTH_USER_EMAIL;
    const password = process.env.AUTH_USER_PASSWORD;
    if (!email || !password) {
      throw new Error(
        "AUTH_USER_EMAIL e AUTH_USER_PASSWORD precisam estar definidos no .env"
      );
    }
    this.email = email;
    this.password = password;
    this.name = process.env.AUTH_USER_NAME ?? "Time R2";
  }

  async findByEmail(email: string): Promise<User | null> {
    if (email.toLowerCase() !== this.email.toLowerCase()) return null;
    return { id: "u_1", email: this.email, name: this.name };
  }

  async verifyCredentials(creds: Credentials): Promise<User | null> {
    const emailOk =
      creds.email.toLowerCase() === this.email.toLowerCase();
    // comparação em tempo constante — barata e evita timing-attack lint
    const passwordOk = constantTimeEqual(creds.password, this.password);
    if (!emailOk || !passwordOk) return null;
    return { id: "u_1", email: this.email, name: this.name };
  }
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
