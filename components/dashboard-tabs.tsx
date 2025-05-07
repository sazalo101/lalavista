"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserBookings } from "@/components/user-bookings"
import { UserProfile } from "@/components/user-profile"

export function DashboardTabs() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("bookings")

  return (
    <Tabs defaultValue="bookings" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      <TabsContent value="bookings">
        <UserBookings />
      </TabsContent>
      <TabsContent value="profile">
        <UserProfile />
      </TabsContent>
    </Tabs>
  )
}
