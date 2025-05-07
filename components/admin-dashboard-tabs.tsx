"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProperties } from "@/components/admin-properties"
import { AdminUsers } from "@/components/admin-users"

export function AdminDashboardTabs() {
  const [activeTab, setActiveTab] = useState("properties")

  return (
    <Tabs defaultValue="properties" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      <TabsContent value="properties">
        <AdminProperties />
      </TabsContent>
      <TabsContent value="users">
        <AdminUsers />
      </TabsContent>
    </Tabs>
  )
}
