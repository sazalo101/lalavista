import { notFound } from "next/navigation"
import { PropertyDetails } from "@/components/property-details"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyAmenities } from "@/components/property-amenities"
import { PropertyLocation } from "@/components/property-location"
import { BookingForm } from "@/components/booking-form"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"

async function getProperty(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const property = await db.collection("properties").findOne({
      _id: new ObjectId(id),
      status: "approved",
    })

    if (!property) {
      return null
    }

    return JSON.parse(JSON.stringify(property))
  } catch (error) {
    console.error("Error fetching property:", error)
    return null
  }
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
      <p className="text-muted-foreground mb-6">
        {property.location.city}, {property.location.county}
      </p>

      <PropertyGallery photos={property.photos} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 mt-8">
        <div className="space-y-8">
          <PropertyDetails property={property} />
          <PropertyAmenities amenities={property.amenities} />
          <PropertyLocation location={property.location} />
        </div>

        <div className="lg:sticky lg:top-20 h-fit">
          <BookingForm property={property} />
        </div>
      </div>
    </div>
  )
}
