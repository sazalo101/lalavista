import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const propertyId = searchParams.get("propertyId")
    const status = searchParams.get("status")

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Build query
    const query: any = {}

    // Regular users can only see their own bookings
    if (session.user.role === "user") {
      query.userId = session.user.id
    }

    // Hosts can see bookings for their properties
    if (session.user.role === "host") {
      // Get properties owned by this host
      const hostProperties = await db
        .collection("properties")
        .find({ hostId: session.user.id })
        .project({ _id: 1 })
        .toArray()

      const propertyIds = hostProperties.map((p) => p._id.toString())
      query.propertyId = { $in: propertyIds }
    }

    // Admin can see all bookings or filter by params
    if (session.user.role === "admin") {
      if (userId) {
        query.userId = userId
      }

      if (propertyId) {
        query.propertyId = propertyId
      }
    }

    if (status) {
      query.status = status
    }

    const bookings = await db.collection("bookings").find(query).toArray()

    // Populate property details
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const property = await db.collection("properties").findOne({
          _id: new ObjectId(booking.propertyId),
        })

        return {
          ...booking,
          property: property
            ? {
                _id: property._id,
                title: property.title,
                location: property.location,
                photos: property.photos,
              }
            : null,
        }
      }),
    )

    return NextResponse.json(populatedBookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookingData = await req.json()

    const client = await clientPromise
    const db = client.db()

    // Check if property exists
    const property = await db.collection("properties").findOne({
      _id: new ObjectId(bookingData.propertyId),
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if property is approved
    if (property.status !== "approved") {
      return NextResponse.json({ error: "Property is not available for booking" }, { status: 400 })
    }

    // Check if dates are available
    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)

    // Check if there are any overlapping bookings
    const overlappingBookings = await db.collection("bookings").findOne({
      propertyId: bookingData.propertyId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lte: checkOut },
          checkOut: { $gte: checkIn },
        },
      ],
    })

    if (overlappingBookings) {
      return NextResponse.json({ error: "Selected dates are not available" }, { status: 400 })
    }

    const booking = {
      ...bookingData,
      userId: session.user.id,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("bookings").insertOne(booking)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...booking,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
