"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Plus } from "lucide-react"
import { MultiFileUpload } from "@/components/multi-file-upload"

const propertyTypes = [
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel" },
  { value: "homestay", label: "Homestay" },
  { value: "lodge", label: "Lodge" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "other", label: "Other" },
]

const amenities = [
  { value: "wifi", label: "WiFi" },
  { value: "parking", label: "Parking" },
  { value: "breakfast", label: "Breakfast" },
  { value: "pool", label: "Swimming Pool" },
  { value: "ac", label: "Air Conditioning" },
  { value: "gym", label: "Gym" },
  { value: "restaurant", label: "Restaurant" },
  { value: "bar", label: "Bar" },
  { value: "spa", label: "Spa" },
  { value: "laundry", label: "Laundry" },
]

export function AddProperty() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    price: "",
    location: {
      address: "",
      city: "",
      county: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    amenities: [] as string[],
    photos: [] as string[],
    rooms: [
      {
        type: "Standard",
        capacity: 2,
        count: 1,
      },
    ],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1]
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value })
  }

  const handleAmenityChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, value],
      })
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== value),
      })
    }
  }

  const handleRoomChange = (index: number, field: string, value: string | number) => {
    const updatedRooms = [...formData.rooms]
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: typeof value === "string" && field !== "type" ? Number.parseInt(value) : value,
    }
    setFormData({ ...formData, rooms: updatedRooms })
  }

  const addRoom = () => {
    setFormData({
      ...formData,
      rooms: [
        ...formData.rooms,
        {
          type: "Standard",
          capacity: 2,
          count: 1,
        },
      ],
    })
  }

  const removeRoom = (index: number) => {
    const updatedRooms = [...formData.rooms]
    updatedRooms.splice(index, 1)
    setFormData({ ...formData, rooms: updatedRooms })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.type || !formData.price) {
        throw new Error("Please fill in all required fields")
      }

      if (!formData.location.address || !formData.location.city || !formData.location.county) {
        throw new Error("Please fill in all location fields")
      }

      if (formData.rooms.length === 0) {
        throw new Error("Please add at least one room")
      }

      // Convert price to number
      const propertyData = {
        ...formData,
        price: Number.parseInt(formData.price),
        availability: [
          {
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
        ],
      }

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create property")
      }

      toast({
        title: "Success",
        description: "Property created successfully",
      })

      router.push("/host")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Property</CardTitle>
        <CardDescription>Fill in the details to list your property</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Luxury Villa in Nairobi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows={5}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Property Type *</Label>
                <Select value={formData.type} onValueChange={handleTypeChange} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Night (KES) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  min={0}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location</h3>
            <div className="space-y-2">
              <Label htmlFor="location.address">Address *</Label>
              <Input
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="e.g. 123 Main Street"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location.city">City *</Label>
                <Input
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="e.g. Nairobi"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location.county">County *</Label>
                <Input
                  id="location.county"
                  name="location.county"
                  value={formData.location.county}
                  onChange={handleChange}
                  placeholder="e.g. Nairobi County"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {amenities.map((amenity) => (
                <div key={amenity.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity.value}`}
                    checked={formData.amenities.includes(amenity.value)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity.value, checked as boolean)}
                  />
                  <Label htmlFor={`amenity-${amenity.value}`}>{amenity.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Rooms</h3>
              <Button type="button" variant="outline" size="sm" onClick={addRoom}>
                <Plus className="h-4 w-4 mr-1" /> Add Room
              </Button>
            </div>
            {formData.rooms.map((room, index) => (
              <div key={index} className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Room {index + 1}</h4>
                  {formData.rooms.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRoom(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`room-${index}-type`}>Room Type</Label>
                    <Input
                      id={`room-${index}-type`}
                      value={room.type}
                      onChange={(e) => handleRoomChange(index, "type", e.target.value)}
                      placeholder="e.g. Standard, Deluxe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`room-${index}-capacity`}>Capacity</Label>
                    <Input
                      id={`room-${index}-capacity`}
                      type="number"
                      value={room.capacity}
                      onChange={(e) => handleRoomChange(index, "capacity", e.target.value)}
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`room-${index}-count`}>Number of Rooms</Label>
                    <Input
                      id={`room-${index}-count`}
                      type="number"
                      value={room.count}
                      onChange={(e) => handleRoomChange(index, "count", e.target.value)}
                      min={1}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Photos</h3>
            <MultiFileUpload value={formData.photos} onChange={(photos) => setFormData({ ...formData, photos })} />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? "Creating Property..." : "Create Property"}
        </Button>
      </CardFooter>
    </Card>
  )
}
