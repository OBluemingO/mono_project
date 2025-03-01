"use client"

import type React from "react"

import { Bell, CreditCard, LogOut, Settings, User } from "lucide-react"
import { redirect } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Session } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { data, status, update } = useSession()
  const [user, setUser] = useState<Session['user']>()
  useEffect(() => {
    if (status != 'authenticated') return

    setUser((data as Session).user)

  }, [status, data?.user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prev = {} as Session['user']) => ({
      ...prev,
      [name]: value,
    }));
  }

  // const handleNotificationChange = (key: keyof typeof data.user.notifications) => {
  // const handleNotificationChange = () => {
  // setUser((prev) => ({
  //   ...prev,
  //   notifications: {
  //     ...prev.notifications,
  //     [key]: !prev.notifications[key],
  //   },
  // }))
  // }

  const handleSave = () => {
    // In a real app, you would save the user data to a database here
    // console.log("Saving user data:", data.user)
    // Show success message or redirect
    update({
      name: user?.name,
      email: user?.email,
    })
  }

  if (status == 'unauthenticated') redirect('/login')

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r md:block">
          <nav className="grid items-start px-4 py-4 text-sm font-medium">
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-3" asChild>
              <a href="/dashboard">
                <User className="h-4 w-4" />
                Profile
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-3" asChild>
              <a href="/dashboard/billing">
                <CreditCard className="h-4 w-4" />
                Billing
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-3" asChild>
              <a href="/dashboard/notifications">
                <Bell className="h-4 w-4" />
                Notifications
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-3" asChild>
              <a href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                Settings
              </a>
            </Button>
            <Separator className="my-4" />
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2 px-3 text-red-500 hover:text-red-600"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg?height=64&width=64" alt={user?.name} />
                      <AvatarFallback className="text-lg">
                        {(data as Session)?.user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={user?.name || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={user?.email || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      // value={data.user.bio}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>Update your shipping and billing address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      // value={user.address}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave}>Save Address</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications and updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                    </div>
                    <Switch
                      id="email-notifications"
                    // checked={user.notifications.email}
                    // onCheckedChange={() => handleNotificationChange("email")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your device.</p>
                    </div>
                    <Switch
                      id="push-notifications"
                    // checked={user.notifications.push}
                    // onCheckedChange={() => handleNotificationChange("push")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive marketing and promotional emails.</p>
                    </div>
                    <Switch
                      id="marketing-notifications"
                    // checked={user.notifications.marketing}
                    // onCheckedChange={() => handleNotificationChange("marketing")}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave}>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

