"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Menu, Mountain } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/projects",
    label: "Projects",
  },
  {
    href: "/about",
    label: "About",
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { data, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-2 items-center mr-4 md:mr-8">
          <Mountain className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">Company</span>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-4 py-4">
              {routes.map((route) => (
                <Button key={route.href} asChild variant="ghost" className={pathname === route.href ? "bg-muted" : ""}>
                  <Link href={route.href}>{route.label}</Link>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`transition-colors hover:text-foreground/80 ${pathname === route.href ? "text-foreground" : "text-foreground/60"}`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        {
          status == 'authenticated' ?
            <div className={'flex ml-auto items-center space-x-4'}>
              <Link href="/dashboard">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt={data.user?.name || ''} />
                  <AvatarFallback className="text-lg">
                    {data.user?.name?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
            :
            status == 'unauthenticated' ?
              <div className={'flex ml-auto items-center space-x-4'}>
                <Button variant="ghost" className="hidden sm:flex" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
              :
              <></>
        }
      </div>
    </header>
  )
}

