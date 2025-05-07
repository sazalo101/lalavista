import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { propertyId, status } = await req.json()

    if (!propertyId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(propertyId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to update property status" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating property status:", error)
    return NextResponse.json({ error: "Failed to update property status" }, { status: 500 })
  }
}
