/**
 * APPLICATION — Use Case: Authenticate
 *
 * No MVP é um wrapper fino sobre o UserRepository, mas existir como
 * use-case próprio significa que amanhã (rate limit, audit log,
 * lockout) você adiciona aqui sem tocar no NextAuth.
 */

import type { UserRepository } from "@/application/ports";
import type { Credentials, User } from "@/domain/auth/types";

export class AuthenticateUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(creds: Credentials): Promise<User | null> {
    return this.users.verifyCredentials(creds);
  }
}
