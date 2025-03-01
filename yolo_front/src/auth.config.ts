// export const authConfig = {};
//  import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export default {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials?.email, password: credentials?.password }),
        });

        const user = await res.json();

        if (!res.ok || !user) {
          throw new Error("Invalid email or password");
        }

        // decode the JWT token and return the user object
        // console.log({
        //   ...user.data,
        //   name: user.data.username
        // })
        // const c = await cookies()
        // c.set('token', user.data.token, {
        //   expires: new Date(Date.now() + 60 * 1000)
        // })
        // c.set('refresh_token', user.data.refreshToken, {
        //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        // })
        return {
          ...user.data,
          name: user.data.username
        } // Must return an object with at least an "id"
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      let tokenJWT = token
      if (trigger === "update" && session) {

        tokenJWT = {
          ...tokenJWT,
          ...session
        }
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/edit/${tokenJWT.id}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              username: tokenJWT.name,
              email: tokenJWT.email,
            }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + tokenJWT.token,
            }
          }
        )
      }
      if (user) {
        return { ...tokenJWT, ...user }
      }

      return tokenJWT;
    },
    async session({ session, token }) {
      // return 
      // if (token) {
      //   console.log('in ttoken session')
      // }

      const sessionNew = {
        user: {
          ...token
        },
        expires: session.expires
      }
      return sessionNew as any
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: "/login",
  },
  // session: {
  //   strategy: "jwt",
  // },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signOut() {
      // const  a = await getCookie("authjs.session-token")
      // await deleteCookie("authjs.session-token")
      // const cookieName = process.env.NODE_ENV === 'production'
      //   ? '__Secure-authjs.session-token' // Default name in production
      //   : 'authjs.session-token'; // Name in development or other environments
      // await deleteCookie(cookieName)
      // console.log("User signed out", a); 
      const c = await cookies()
      c.delete('token')
      c.delete('refresh_token')
    }
  }
} satisfies NextAuthConfig