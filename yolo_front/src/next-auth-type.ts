import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      token?: string; // Custom field
      refreshToken?: string; // Custom field
    } & DefaultSession['user']
  }
}
