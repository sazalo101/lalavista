import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const destinations = [
  {
    name: "Nairobi",
    image: "/placeholder.svg?height=300&width=400",
    properties: 120,
  },
  {
    name: "Mombasa",
    image: "/placeholder.svg?height=300&width=400",
    properties: 85,
  },
  {
    name: "Nakuru",
    image: "/placeholder.svg?height=300&width=400",
    properties: 42,
  },
  {
    name: "Kisumu",
    image: "/placeholder.svg?height=300&width=400",
    properties: 38,
  },
]

export function PopularDestinations() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Popular Destinations</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Explore the most sought-after locations across Kenya.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-4">
          {destinations.map((destination) => (
            <Link key={destination.name} href={`/properties?city=${destination.name}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <CardContent className="absolute bottom-0 p-4 text-white">
                    <h3 className="font-bold">{destination.name}</h3>
                    <p className="text-sm">{destination.properties} properties</p>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
