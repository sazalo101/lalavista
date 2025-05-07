"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export function PropertyGallery({ photos = [] }: { photos: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // If no photos, show placeholder
  if (photos.length === 0) {
    photos = ["/placeholder.svg?height=600&width=800"]
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative aspect-video md:aspect-[4/3] overflow-hidden rounded-lg">
          <div className="w-full h-full bg-muted">
            <Image
              src={photos[0] || "/placeholder.svg?height=600&width=800"}
              alt="Property main image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="absolute bottom-4 right-4" onClick={() => setCurrentIndex(0)}>
                View all photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] p-0">
              <div className="relative h-full w-full">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Image
                    src={photos[currentIndex] || "/placeholder.svg"}
                    alt={`Property photo ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-background/80"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-2 py-1 rounded-full text-xs">
                  {currentIndex + 1} / {photos.length}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {photos.slice(1, 5).map((photo, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
              <div className="w-full h-full bg-muted">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Property photo ${index + 2}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {index === 3 && photos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary">+{photos.length - 5} more</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh] p-0">
                      <div className="relative h-full w-full">
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Image
                            src={photos[4] || "/placeholder.svg"}
                            alt={`Property photo 5`}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 rounded-full bg-background/80"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
