import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function PropertyLocation({ location }: { location: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p>{location.address}</p>
            <p className="text-muted-foreground">
              {location.city}, {location.county}
            </p>
          </div>
        </div>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Map view will be available soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
