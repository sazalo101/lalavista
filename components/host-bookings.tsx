"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export function HostBookings() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bookingToUpdate, setBookingToUpdate] = useState<string | null>(null)
  const [updateStatus, setUpdateStatus] = useState<"confirmed" | "rejected">("confirmed")
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleUpdateBooking = async () => {
    if (!bookingToUpdate) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/bookings/${bookingToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: updateStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update booking")
      }

      toast({
        title: "Success",
        description: `Booking ${updateStatus} successfully`,
      })

      // Update bookings list
      setBookings(
        bookings.map((booking) => (booking._id === bookingToUpdate ? { ...booking, status: updateStatus } : booking)),
      )
    } catch (error) {
      console.error("Error updating booking:", error)
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setBookingToUpdate(null)
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

  const pendingBookings = bookings.filter((booking) => booking.status === "pending")
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed")
  const otherBookings = bookings.filter((booking) => booking.status !== "pending" && booking.status !== "confirmed")

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex flex-col md:flex-row">
              <div className="h-48 w-full md:w-64 bg-muted"></div>
              <CardContent className="p-4 flex-1">
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="flex justify-between mt-4">
                    <div className="h-10 bg-muted rounded w-24"></div>
                    <div className="h-10 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No bookings found</h3>
          <p className="text-muted-foreground">You don&apos;t have any bookings for your properties yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="pending">
      <TabsList className="mb-4">
        <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
        <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
        <TabsTrigger value="other">Other ({otherBookings.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <div className="space-y-4">
          {pendingBookings.length > 0 ? (
            pendingBookings.map((booking) => (
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
                  <CardContent className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{booking.property?.title || "Property"}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Guest:</span> {booking.contactInfo.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Contact:</span> {booking.contactInfo.email},{" "}
                        {booking.contactInfo.phone}
                      </p>
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
                    <div className="flex justify-between items-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
                      </Button>
                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                setBookingToUpdate(booking._id)
                                setUpdateStatus("rejected")
                              }}
                            >
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject this booking?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleUpdateBooking} disabled={isUpdating}>
                                {isUpdating ? "Rejecting..." : "Reject"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={() => {
                                setBookingToUpdate(booking._id)
                                setUpdateStatus("confirmed")
                              }}
                            >
                              Confirm
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to confirm this booking?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleUpdateBooking} disabled={isUpdating}>
                                {isUpdating ? "Confirming..." : "Confirm"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You don&apos;t have any pending bookings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="confirmed">
        <div className="space-y-4">
          {confirmedBookings.length > 0 ? (
            confirmedBookings.map((booking) => (
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
                  <CardContent className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{booking.property?.title || "Property"}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Guest:</span> {booking.contactInfo.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Contact:</span> {booking.contactInfo.email},{" "}
                        {booking.contactInfo.phone}
                      </p>
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
                    <div className="flex justify-between items-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You don&apos;t have any confirmed bookings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="other">
        <div className="space-y-4">
          {otherBookings.length > 0 ? (
            otherBookings.map((booking) => (
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
                  <CardContent className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{booking.property?.title || "Property"}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Guest:</span> {booking.contactInfo.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Contact:</span> {booking.contactInfo.email},{" "}
                        {booking.contactInfo.phone}
                      </p>
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
                    <div className="flex justify-between items-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You don&apos;t have any other bookings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
