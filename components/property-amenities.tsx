import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PropertyAmenities({ amenities = [] }: { amenities: string[] }) {
  if (amenities.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
