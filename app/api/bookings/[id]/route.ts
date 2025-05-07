import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(id),
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if user can view this booking
    if (session.user.role !== "admin" && session.user.id !== booking.userId) {
      // If user is a host, check if they own the property
      if (session.user.role === "host") {
        const property = await db.collection("properties").findOne({
          _id: new ObjectId(booking.propertyId),
          hostId: session.user.id,
        })

        if (!property) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Populate property details
    const property = await db.collection("properties").findOne({
      _id: new ObjectId(booking.propertyId),
    })

    return NextResponse.json({
      ...booking,
      property: property
        ? {
            _id: property._id,
            title: property.title,
            location: property.location,
            photos: property.photos,
          }
        : null,
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
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

    // Check if booking exists
    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(id),
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === "user") {
      // Users can only update their own bookings and only cancel them
      if (booking.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Users can only cancel bookings
      if (updateData.status && updateData.status !== "cancelled") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    } else if (session.user.role === "host") {
      // Hosts can only update bookings for their properties
      const property = await db.collection("properties").findOne({
        _id: new ObjectId(booking.propertyId),
        hostId: session.user.id,
      })

      if (!property) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Hosts can only confirm or reject bookings
      if (updateData.status && updateData.status !== "confirmed" && updateData.status !== "rejected") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Update booking
    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
