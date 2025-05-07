"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
]

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    minPrice: searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice") as string) : 0,
    maxPrice: searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice") as string) : 50000,
    amenities: searchParams.get("amenities") ? (searchParams.get("amenities") as string).split(",") : [],
  })

  const [priceRange, setPriceRange] = useState<number[]>([filters.minPrice || 0, filters.maxPrice || 50000])

  useEffect(() => {
    // Update filters when search params change
    setFilters({
      location: searchParams.get("location") || "",
      type: searchParams.get("type") || "",
      minPrice: searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice") as string) : 0,
      maxPrice: searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice") as string) : 50000,
      amenities: searchParams.get("amenities") ? (searchParams.get("amenities") as string).split(",") : [],
    })

    setPriceRange([
      searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice") as string) : 0,
      searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice") as string) : 50000,
    ])
  }, [searchParams])

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, location: e.target.value })
  }

  const handleTypeChange = (value: string) => {
    setFilters({ ...filters, type: value })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    setFilters({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    })
  }

  const handleAmenityChange = (value: string, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        amenities: [...filters.amenities, value],
      })
    } else {
      setFilters({
        ...filters,
        amenities: filters.amenities.filter((a) => a !== value),
      })
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.location) {
      params.set("location", filters.location)
    }

    if (filters.type) {
      params.set("type", filters.type)
    }

    if (filters.minPrice > 0) {
      params.set("minPrice", filters.minPrice.toString())
    }

    if (filters.maxPrice < 50000) {
      params.set("maxPrice", filters.maxPrice.toString())
    }

    if (filters.amenities.length > 0) {
      params.set("amenities", filters.amenities.join(","))
    }

    router.push(`/properties?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      location: "",
      type: "",
      minPrice: 0,
      maxPrice: 50000,
      amenities: [],
    })
    setPriceRange([0, 50000])
    router.push("/properties")
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, county, or area"
            value={filters.location}
            onChange={handleLocationChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Price Range (KES)</Label>
            <span className="text-sm">
              {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
            </span>
          </div>
          <Slider value={priceRange} min={0} max={50000} step={1000} onValueChange={handlePriceChange} />
        </div>

        <Accordion type="single" collapsible defaultValue="amenities">
          <AccordionItem value="amenities">
            <AccordionTrigger>Amenities</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {amenities.map((amenity) => (
                  <div key={amenity.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity.value}`}
                      checked={filters.amenities.includes(amenity.value)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity.value, checked as boolean)}
                    />
                    <Label htmlFor={`amenity-${amenity.value}`}>{amenity.label}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
