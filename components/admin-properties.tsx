"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export function AdminProperties() {
  const { toast } = useToast()
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null)
  const [updateStatus, setUpdateStatus] = useState<"approved" | "rejected">("approved")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      // Use status=all to fetch all properties regardless of status
      const response = await fetch("/api/properties?status=all")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch properties")
      }

      setProperties(data)
    } catch (error) {
      console.error("Error fetching properties:", error)
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProperty = async () => {
    if (!propertyToUpdate) return

    setIsUpdating(true)
    try {
      const response = await fetch("/api/admin/properties", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: propertyToUpdate,
          status: updateStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update property")
      }

      toast({
        title: "Success",
        description: `Property ${updateStatus} successfully`,
      })

      // Update properties list
      setProperties(
        properties.map((property) =>
          property._id === propertyToUpdate ? { ...property, status: updateStatus } : property,
        ),
      )
    } catch (error) {
      console.error("Error updating property:", error)
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setPropertyToUpdate(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending Approval</Badge>
      case "approved":
        return <Badge variant="success">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const pendingProperties = properties.filter((property) => property.status === "pending")
  const approvedProperties = properties.filter((property) => property.status === "approved")
  const rejectedProperties = properties.filter((property) => property.status === "rejected")

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted"></div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No properties found</h3>
          <p className="text-muted-foreground">There are no properties in the system yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="pending">
      <TabsList className="mb-4">
        <TabsTrigger value="pending">Pending ({pendingProperties.length})</TabsTrigger>
        <TabsTrigger value="approved">Approved ({approvedProperties.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({rejectedProperties.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingProperties.length > 0 ? (
            pendingProperties.map((property) => (
              <Card key={property._id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <div className="w-full h-full bg-muted">
                    {/* Use next/image with unoptimized for external URLs */}
                    {property.photos?.[0] && (
                      <Image
                        src={property.photos[0] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="absolute top-2 right-2">{getStatusBadge(property.status)}</div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {property.location.city}, {property.location.county}
                  </p>
                  <p className="text-sm mb-4 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/properties/${property._id}`}>View</Link>
                    </Button>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setPropertyToUpdate(property._id)
                              setUpdateStatus("rejected")
                            }}
                          >
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this property?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleUpdateProperty} disabled={isUpdating}>
                              {isUpdating ? "Rejecting..." : "Reject"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              setPropertyToUpdate(property._id)
                              setUpdateStatus("approved")
                            }}
                          >
                            Approve
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Approve Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve this property?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleUpdateProperty} disabled={isUpdating}>
                              {isUpdating ? "Approving..." : "Approve"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">There are no pending properties.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="approved">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedProperties.length > 0 ? (
            approvedProperties.map((property) => (
              <Card key={property._id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <div className="w-full h-full bg-muted">
                    {property.photos?.[0] && (
                      <Image
                        src={property.photos[0] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="absolute top-2 right-2">{getStatusBadge(property.status)}</div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {property.location.city}, {property.location.county}
                  </p>
                  <p className="text-sm mb-4 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/properties/${property._id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">There are no approved properties.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="rejected">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rejectedProperties.length > 0 ? (
            rejectedProperties.map((property) => (
              <Card key={property._id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <div className="w-full h-full bg-muted">
                    {property.photos?.[0] && (
                      <Image
                        src={property.photos[0] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="absolute top-2 right-2">{getStatusBadge(property.status)}</div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {property.location.city}, {property.location.county}
                  </p>
                  <p className="text-sm mb-4 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/properties/${property._id}`}>View</Link>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setPropertyToUpdate(property._id)
                        setUpdateStatus("approved")
                        handleUpdateProperty()
                      }}
                    >
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">There are no rejected properties.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
