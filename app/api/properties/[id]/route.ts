import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const client = await clientPromise
    const db = client.db()

    const property = await db.collection("properties").findOne({
      _id: new ObjectId(id),
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if user can view this property
    const session = await getServerSession(authOptions)
    if (
      property.status !== "approved" &&
      (!session ||
        (session.user.role !== "admin" && (session.user.role !== "host" || property.hostId !== session.user.id)))
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updateData = await req.json()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if property exists and user has permission
    const property = await db.collection("properties").findOne({
      _id: new ObjectId(id),
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (session.user.role !== "admin" && (session.user.role !== "host" || property.hostId !== session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update property
    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if property exists and user has permission
    const property = await db.collection("properties").findOne({
      _id: new ObjectId(id),
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (session.user.role !== "admin" && (session.user.role !== "host" || property.hostId !== session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete property
    const result = await db.collection("properties").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}
