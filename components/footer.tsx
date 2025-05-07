import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Lalavista</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-muted-foreground hover:text-foreground">
                  Safety Information
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Hosting</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/host/signup" className="text-muted-foreground hover:text-foreground">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/host/resources" className="text-muted-foreground hover:text-foreground">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/host/community" className="text-muted-foreground hover:text-foreground">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Destinations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?city=Nairobi" className="text-muted-foreground hover:text-foreground">
                  Nairobi
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Mombasa" className="text-muted-foreground hover:text-foreground">
                  Mombasa
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Nakuru" className="text-muted-foreground hover:text-foreground">
                  Nakuru
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Lalavista. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
