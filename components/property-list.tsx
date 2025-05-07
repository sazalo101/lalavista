import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Wifi, Car, Coffee } from "lucide-react"
import clientPromise from "@/lib/db"

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
}

async function getProperties(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    const client = await clientPromise
    const db = client.db()

    // Build query
    const query: any = { status: "approved" }

    const location = searchParams.location || searchParams.city || searchParams.county
    if (location) {
      const locationStr = Array.isArray(location) ? location[0] : location
      query["$or"] = [
        { "location.city": { $regex: locationStr, $options: "i" } },
        { "location.county": { $regex: locationStr, $options: "i" } },
        { "location.address": { $regex: locationStr, $options: "i" } },
      ]
    }

    const type = searchParams.type
    if (type) {
      query.type = Array.isArray(type) ? type[0] : type
    }

    const minPrice = searchParams.minPrice
    if (minPrice) {
      const minPriceNum = Number.parseInt(Array.isArray(minPrice) ? minPrice[0] : minPrice)
      if (!isNaN(minPriceNum)) {
        query.price = { ...query.price, $gte: minPriceNum }
      }
    }

    const maxPrice = searchParams.maxPrice
    if (maxPrice) {
      const maxPriceNum = Number.parseInt(Array.isArray(maxPrice) ? maxPrice[0] : maxPrice)
      if (!isNaN(maxPriceNum)) {
        query.price = { ...query.price, $lte: maxPriceNum }
      }
    }

    const amenities = searchParams.amenities
    if (amenities) {
      const amenitiesArr = Array.isArray(amenities) ? amenities : amenities.split(",")

      if (amenitiesArr.length > 0) {
        query.amenities = { $all: amenitiesArr }
      }
    }

    const properties = await db.collection("properties").find(query).sort({ createdAt: -1 }).toArray()

    return JSON.parse(JSON.stringify(properties))
  } catch (error) {
    console.error("Error fetching properties:", error)
    return []
  }
}

export async function PropertyList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const properties = await getProperties(searchParams)

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No properties found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your search filters or explore other areas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {properties.map((property: any) => (
        <Card key={property._id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 w-full md:w-64">
              <div className="w-full h-full bg-muted">
                <Image
                  src={property.photos?.[0] || "/placeholder.svg?height=300&width=400"}
                  alt={property.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex flex-col justify-between p-4 flex-1">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  <Badge variant="outline">{property.type}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {property.location.city}, {property.location.county}
                  </span>
                </div>
                <p className="text-sm mt-2 line-clamp-2">{property.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {property.amenities?.slice(0, 3).map((amenity: string) => {
                    const Icon = amenityIcons[amenity.toLowerCase()] || null
                    return (
                      <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                        {Icon && <Icon className="h-3 w-3" />}
                        {amenity}
                      </Badge>
                    )
                  })}
                  {property.amenities?.length > 3 && (
                    <Badge variant="secondary">+{property.amenities.length - 3} more</Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-lg font-bold">
                  KES {property.price.toLocaleString()} <span className="text-sm font-normal">/ night</span>
                </div>
                <Button asChild>
                  <Link href={`/properties/${property._id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
