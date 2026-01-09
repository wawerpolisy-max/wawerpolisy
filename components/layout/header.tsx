"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Lock } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [insuranceDropdownOpen, setInsuranceDropdownOpen] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setInsuranceDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setInsuranceDropdownOpen(false)
    }, 300) // 300ms delay before closing
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-8">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/logo-wawerpolisy.png"
              alt="wawerpolisy.pl Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-primary">wawerpolisy.pl</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {/* Ubezpieczenia Dropdown */}
            <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button className="flex items-center gap-1 text-foreground font-medium hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/5">
                Ubezpieczenia
                <ChevronDown className="h-4 w-4" />
              </button>

              {insuranceDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2">
                  <Link
                    href="/ubezpieczenia/komunikacyjne"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Komunikacyjne
                  </Link>
                  <Link
                    href="/ubezpieczenia/mieszkaniowe"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Mieszkaniowe
                  </Link>
                  <Link
                    href="/ubezpieczenia/turystyczne"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Turystyczne
                  </Link>
                  <Link
                    href="/ubezpieczenia/firmowe"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Firmowe
                  </Link>
                  <Link
                    href="/ubezpieczenia/zdrowotne"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Zdrowotne
                  </Link>
                  <Link
                    href="/ubezpieczenia/zyciowe"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Na Życie
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/apk"
              className="text-foreground font-medium hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              APK
            </Link>

            <Link
              href="/faq"
              className="text-foreground font-medium hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              FAQ
            </Link>

            <Link
              href="/o-mnie"
              className="text-foreground font-medium hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              O mnie
            </Link>

            <Link
              href="/kontakt"
              className="text-foreground font-medium hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              Kontakt
            </Link>
          </nav>

          <div className="hidden lg:block shrink-0">
            <Button
              asChild
              size="icon"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-sm hover:shadow-md transition-all h-10 w-10"
              title="Panel klienta"
            >
              <Link href="/portal">
                <Lock className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="font-semibold text-sm text-muted-foreground px-2">Ubezpieczenia</div>
              <Link
                href="/ubezpieczenia/komunikacyjne"
                className="block py-2 pl-4 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Komunikacyjne
              </Link>
              <Link
                href="/ubezpieczenia/mieszkaniowe"
                className="block py-2 pl-4 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mieszkaniowe
              </Link>
              <Link
                href="/ubezpieczenia/turystyczne"
                className="block py-2 pl-4 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Turystyczne
              </Link>
              <Link
                href="/ubezpieczenia/firmowe"
                className="block py-2 pl-4 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Firmowe
              </Link>
              <Link
                href="/ubezpieczenia/zdrowotne"
                className="block py-2 pl-4 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Zdrowotne
              </Link>
              <Link
                href="/ubezpieczenia/zyciowe"
                className="block py-2 pl-4 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Na Życie
              </Link>
            </div>

            <Link
              href="/apk"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              APK
            </Link>
            <Link
              href="/faq"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/o-mnie"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              O mnie
            </Link>
            <Link
              href="/kontakt"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kontakt
            </Link>

            <div className="pt-4">
              <Link href="/portal" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  Panel klienta
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
