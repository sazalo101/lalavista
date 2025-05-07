export interface Property {
  _id?: string
  hostId: string
  title: string
  description: string
  type: "hotel" | "hostel" | "homestay" | "lodge" | "apartment" | "villa" | "other" // Added hostel
  location: {
    address: string
    city: string
    county: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  price: number
  amenities: string[]
  photos: string[]
  rooms: {
    type: string
    capacity: number
    count: number
  }[]
  availability: {
    startDate: Date
    endDate: Date
  }[]
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}
