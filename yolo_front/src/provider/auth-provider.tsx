"use client";

import { SessionProvider } from "next-auth/react";
/* eslint-disable  @typescript-eslint/no-explicit-any */
export default function AuthProvider({ children, session }: { children: React.ReactNode, session: any }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
