"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HostProperties } from "@/components/host-properties"
import { HostBookings } from "@/components/host-bookings"
import { AddProperty } from "@/components/add-property"

export function HostDashboardTabs() {
  const [activeTab, setActiveTab] = useState("properties")

  return (
    <Tabs defaultValue="properties" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="properties">My Properties</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="add">Add Property</TabsTrigger>
      </TabsList>
      <TabsContent value="properties">
        <HostProperties />
      </TabsContent>
      <TabsContent value="bookings">
        <HostBookings />
      </TabsContent>
      <TabsContent value="add">
        <AddProperty />
      </TabsContent>
    </Tabs>
  )
}
