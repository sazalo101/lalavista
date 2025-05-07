import { Suspense } from "react"
import { PropertyList } from "@/components/property-list"
import { PropertyFilters } from "@/components/property-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <PropertyFilters />
        <div>
          <Suspense fallback={<PropertyListSkeleton />}>
            <PropertyList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PropertyListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
          <Skeleton className="h-48 w-full md:w-64 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
