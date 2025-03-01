"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card } from "./ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type formValues = z.infer<typeof formSchema>

export default function ForgotPassword() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: formValues) {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/password-reset-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        setServerError(data.error);
        return
      }
      router.push(data.resetUrl)
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.")
    }
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col items-center justify-center px-4 py-4 ">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 ">
              Forgot your password?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 ">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
          </div>
          <Form {...form}>
            <form className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && <div className="text-sm font-medium text-destructive">{serverError}</div>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reset password...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </Form>
          <div className="flex justify-center">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              prefetch={false}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}