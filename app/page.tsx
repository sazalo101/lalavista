import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { FeaturedProperties } from "@/components/featured-properties"
import { PopularDestinations } from "@/components/popular-destinations"

export default async function Home() {
  // Check if user is logged in and redirect to appropriate dashboard
  const session = await getServerSession(authOptions)

  if (session) {
    switch (session.user.role) {
      case "admin":
        redirect("/admin")
      case "host":
        redirect("/host")
      case "user":
        redirect("/dashboard")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover Your Perfect Stay in Kenya
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Find and book accommodations across Kenya. From luxury hotels to cozy homestays, we've got you
                  covered.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/host/signup">Become a Host</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[400px] lg:max-w-none">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <FeaturedProperties />

      {/* Popular Destinations */}
      <PopularDestinations />

      {/* How It Works */}
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Lalavista makes it easy to find and book your perfect stay in Kenya.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">1</div>
              <h3 className="text-xl font-bold">Search</h3>
              <p className="text-muted-foreground">Find the perfect accommodation by location, type, or amenities.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">2</div>
              <h3 className="text-xl font-bold">Book</h3>
              <p className="text-muted-foreground">
                Reserve your stay with a simple booking process, no payment required.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">3</div>
              <h3 className="text-xl font-bold">Enjoy</h3>
              <p className="text-muted-foreground">
                Receive confirmation and enjoy your stay at your chosen accommodation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Find Your Perfect Stay?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Join thousands of travelers who have found their ideal accommodations through Lalavista.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/properties">Start Searching</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup">Create an Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
