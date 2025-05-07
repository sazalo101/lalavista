import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city")
    const county = searchParams.get("county")
    const type = searchParams.get("type")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const amenities = searchParams.get("amenities")?.split(",")
    const status = searchParams.get("status") || "approved"

    const client = await clientPromise
    const db = client.db()

    // Build query
    const query: any = { status: "approved" }

    if (city) {
      query["location.city"] = { $regex: city, $options: "i" }
    }

    if (county) {
      query["location.county"] = { $regex: county, $options: "i" }
    }

    if (type) {
      query.type = type
    }

    if (minPrice) {
      query.price = { ...query.price, $gte: Number.parseInt(minPrice) }
    }

    if (maxPrice) {
      query.price = { ...query.price, $lte: Number.parseInt(maxPrice) }
    }

    if (amenities && amenities.length > 0) {
      query.amenities = { $all: amenities }
    }

    // Admin can see all properties
    const session = await getServerSession(authOptions)
    if (session?.user.role === "admin") {
      if (status === "all") {
        delete query.status // Remove status filter to see all properties
      } else if (status) {
        query.status = status
      }
    }

    // Host can see their own properties regardless of status
    if (session?.user.role === "host") {
      const hostId = searchParams.get("hostId")
      if (hostId && hostId === session.user.id) {
        query.hostId = hostId
        delete query.status
      }
    }

    const properties = await db.collection("properties").find(query).toArray()

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "host" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const propertyData = await req.json()

    const client = await clientPromise
    const db = client.db()

    // Set default status based on role
    const status = session.user.role === "admin" ? "approved" : "pending"

    const property = {
      ...propertyData,
      hostId: session.user.id,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("properties").insertOne(property)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...property,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
