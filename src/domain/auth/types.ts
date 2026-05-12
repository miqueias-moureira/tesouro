/**
 * DOMAIN — Auth
 *
 * O domínio NÃO conhece NextAuth. Aqui mora o conceito de "usuário"
 * para o produto. A infra (NextAuth) implementa as portas.
 */

export interface User {
  id: string;
  email: string;
  name: string;
}

/** credenciais que o usuário digita no form */
export interface Credentials {
  email: string;
  password: string;
}
