import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import clientPromise from "@/lib/db"

async function getFeaturedProperties() {
  try {
    const client = await clientPromise
    const db = client.db()

    const properties = await db
      .collection("properties")
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray()

    return JSON.parse(JSON.stringify(properties))
  } catch (error) {
    console.error("Error fetching featured properties:", error)
    return []
  }
}

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties()

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Properties</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Discover our handpicked selection of the best accommodations across Kenya.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3">
          {properties.length > 0
            ? properties.map((property: any) => (
                <Link key={property._id} href={`/properties/${property._id}`}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-video relative overflow-hidden">
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
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {property.location.city}, {property.location.county}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="outline">{property.type}</Badge>
                        {property.amenities?.slice(0, 2).map((amenity: string) => (
                          <Badge key={amenity} variant="secondary">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="text-lg font-bold">
                        KES {property.price.toLocaleString()} <span className="text-sm font-normal">/ night</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-5 w-2/3 bg-muted rounded" />
                    <div className="mt-2 h-4 w-1/2 bg-muted rounded" />
                    <div className="mt-2 flex gap-1">
                      <div className="h-5 w-16 bg-muted rounded" />
                      <div className="h-5 w-16 bg-muted rounded" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="h-6 w-1/3 bg-muted rounded" />
                  </CardFooter>
                </Card>
              ))}
        </div>
        <div className="flex justify-center">
          <Link href="/properties">
            <Button>View All Properties</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
