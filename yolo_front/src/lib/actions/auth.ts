"use server"

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"

export async function login(formData: LoginFormValues) {
  // Validate form fields on the server
  const validatedFields = loginSchema.safeParse(formData)

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please check your inputs.",
    }
  }

  const { email, password } = validatedFields.data

  try {
    // This is where you would typically:
    // 1. Call your authentication API or service
    // 2. Verify credentials
    // 3. Create a session

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    if (response.status == 200) {
      return {
        message: 'success'
      }
    }
    // If credentials are invalid
    return {
      error: "Invalid email or password. Please try again.",
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    } else if (typeof error === "string") {
      return { error: error }
    } else {
      return {
        error: "An error occurred during login. Please try again.",
      }
    }
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    // Here you would verify the token and update the password in your database
    // This is a placeholder implementation

    // 1. Verify the JWT token
    // const payload = await verifyToken(token);

    // 2. Update the user's password
    // await updateUserPassword(payload.userId, password);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        new_password: password
      })
    })
    if (!response.ok) {
      const error = await response.json()
      throw error.error
    }
    return { success: true }
  } catch (error) {
    console.error("Error resetting password:", error)
    return { success: false, error: "Failed to reset password. The token may be invalid or expired." }
  }
}

