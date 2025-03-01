// import { withAuth } from "next-auth/middleware";
import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import authConfig from "./auth.config";

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   //check cookie if exists
//   const token = request.cookies.get('token')?.value
//   const protect_routes = ['/dashboard']
//   const protectPage = protect_routes.some((path) => {
//     const matchPath = request.nextUrl.pathname.startsWith(path);
//     return matchPath;
//   });

//   if (protectPage && !token) return NextResponse.redirect(new URL('/', request.url))

//   return NextResponse.next()
// }
// export default withAuth({
//   pages: {
//     signIn: "/login",
//   },
// });

// export default withAuth(
//   function middleware(req) {
//     const { nextUrl } = req;

//     // If user is authenticated and trying to access /login, redirect to homepage
//     const protect_routes_from_login = ['/login', '/signup']
//     if (req.nextauth.token && protect_routes_from_login.some((path) => nextUrl.pathname.startsWith(path))) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => true, // Allow middleware to run for all users
//     },
//   }
// );
// export default NextAuth(authConfig as any).auth;
const { auth } = NextAuth(authConfig as any)
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
})

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    // dashboard page and sub page of dashboard
    // '/dashboard/:path*',
  ],
}