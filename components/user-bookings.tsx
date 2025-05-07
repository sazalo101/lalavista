"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function UserBookings() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (session) {
      fetchBookings()
    }
  }, [session])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/bookings")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch bookings")
      }

      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return

    setIsCancelling(true)
    try {
      const response = await fetch(`/api/bookings/${bookingToCancel}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel booking")
      }

      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      })

      // Update bookings list
      setBookings(
        bookings.map((booking) => (booking._id === bookingToCancel ? { ...booking, status: "cancelled" } : booking)),
      )
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
      setBookingToCancel(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const upcomingBookings = bookings.filter(
    (booking) =>
      (booking.status === "pending" || booking.status === "confirmed") && new Date(booking.checkOut) >= new Date(),
  )

  const pastBookings = bookings.filter(
    (booking) => booking.status === "confirmed" && new Date(booking.checkOut) < new Date(),
  )

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled" || booking.status === "rejected",
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-muted rounded w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No bookings found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven&apos;t made any bookings yet. Start exploring properties to book your stay.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/properties">Browse Properties</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-4">
        <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
        <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <div className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 w-full md:w-64">
                    <Image
                      src={booking.property?.photos?.[0] || "/placeholder.svg?height=300&width=400"}
                      alt={booking.property?.title || "Property"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-4 flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{booking.property?.title || "Property"}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.property?.location?.city}, {booking.property?.location?.county}
                      </p>
                      <div className="mt-4 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Check-in:</span> {format(new Date(booking.checkIn), "PPP")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Check-out:</span> {format(new Date(booking.checkOut), "PPP")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Guests:</span> {booking.guests}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
                      </Button>
                      {booking.status !== "cancelled" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" onClick={() => setBookingToCancel(booking._id)}>
                              Cancel Booking
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                              <AlertDialogAction onClick={handleCancelBooking} disabled={isCancelling}>
                                {isCancelling ? "Cancelling..." : "Yes, cancel booking"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">You don&apos;t have any upcoming bookings.</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="past">
        <div className="space-y-4">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 w-full md:w-64">
                    <Image
                      src={booking.property?.photos?.[0] || "/placeholder.svg?height=300&width=400"}
                      alt={booking.property?.title || "Property"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-4 flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{booking.property?.title || "Property"}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.property?.location?.city}, {booking.property?.location?.county}
                      </p>
                      <div className="mt-4 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Check-in:</span> {format(new Date(booking.checkIn), "PPP")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Check-out:</span> {format(new Date(booking.checkOut), "PPP")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Guests:</span> {booking.guests}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">You don&apos;t have any past bookings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="cancelled">
        <div className="space-y-4">
          {cancelledBookings.length > 0 ? (
            cancelledBookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 w-full md:w-64">
                    <Image
                      src={booking.property?.photos?.[0] || "/placeholder.svg?height=300&width=400"}
                      alt={booking.property?.title || "Property"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-4 flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{booking.property?.title || "Property"}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.property?.location?.city}, {booking.property?.location?.county}
                      </p>
                      <div className="mt-4 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Check-in:</span> {format(new Date(booking.checkIn), "PPP")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Check-out:</span> {format(new Date(booking.checkOut), "PPP")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Guests:</span> {booking.guests}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">You don&apos;t have any cancelled bookings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
