import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bed, Users } from "lucide-react"

export function PropertyDetails({ property }: { property: any }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{property.type}</Badge>
        {property.amenities?.slice(0, 3).map((amenity: string) => (
          <Badge key={amenity} variant="secondary">
            {amenity}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {property.rooms?.map((room: any, index: number) => (
          <Card key={index}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">{room.type}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bed className="h-4 w-4" />
                <span>
                  {room.count} {room.count > 1 ? "rooms" : "room"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Users className="h-4 w-4" />
                <span>
                  Fits {room.capacity} {room.capacity > 1 ? "guests" : "guest"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
      </div>
    </div>
  )
}
