import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get all users
    const users = await db.collection("users").find({}).toArray()

    // For each host, count their properties
    const usersWithPropertyCount = await Promise.all(
      users.map(async (user) => {
        if (user.role === "host") {
          const propertyCount = await db.collection("properties").countDocuments({ hostId: user._id.toString() })
          return { ...user, propertyCount }
        }
        return user
      }),
    )

    return NextResponse.json(usersWithPropertyCount)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
