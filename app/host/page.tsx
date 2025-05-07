import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { HostDashboardTabs } from "@/components/host-dashboard-tabs"

export default async function HostDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "host" && session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Host Dashboard</h1>
      <HostDashboardTabs />
    </div>
  )
}
