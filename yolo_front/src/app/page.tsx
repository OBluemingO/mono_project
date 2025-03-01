import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Github, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-28 lg:py-32 max-w-5xl mx-auto">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Building digital experiences with passion
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
            Frontend developer and designer crafting beautiful, functional websites and applications. Focused on React,
            TypeScript, and modern web technologies.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="px-4 py-16 md:py-24 border-t bg-muted/50">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Latest Articles</h2>
            <p className="text-muted-foreground">Thoughts on development, design, and technology.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-2 transition-colors hover:border-foreground">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-lg">Understanding React Server Components</CardTitle>
                  <CardDescription>March 1, 2024 • 5 min read</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    An in-depth look at React Server Components and how they change the way we build web applications.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button variant="ghost" className="group" asChild>
              <Link href="/blog">
                View all posts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Selected Work</h2>
            <p className="text-muted-foreground">A collection of projects I&apos;ve worked on.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden border-2 transition-all hover:border-foreground">
                <Image
                  src={`/placeholder.svg?height=400&width=800`}
                  width={800}
                  height={400}
                  alt="Project thumbnail"
                  className="object-cover aspect-[2/1]"
                />
                <CardHeader>
                  <CardTitle>Project {i}</CardTitle>
                  <CardDescription>
                    A brief description of the project, technologies used, and the problem it solves.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group" asChild>
                    <Link href={`/projects/${i}`}>
                      View Project
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16 md:py-24 border-t bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Let&apos;s work together</h2>
              <p className="text-muted-foreground">
                I&apos;m always interested in hearing about new projects and opportunities.
              </p>
              <div className="space-y-2">
                <Button className="w-full sm:w-auto" asChild>
                  <Link href="/contact">Get in touch</Link>
                </Button>
                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="https://github.com">
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="https://twitter.com">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <Card className="p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">hello@example.com</p>
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-muted-foreground">San Francisco, CA</p>
                </div>
                <div>
                  <h3 className="font-medium">Availability</h3>
                  <p className="text-muted-foreground">Open to new projects</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

