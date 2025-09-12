"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Database, Calculator, History, Plus } from "lucide-react"

const navigation = [
  { name: "Data Sources", href: "/", icon: Database },
  { name: "Pricing Calculator", href: "/calculator", icon: Calculator },
  { name: "History", href: "/history", icon: History },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-card border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-primary">DataPricing</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-semibold leading-6 transition-colors ${
                  isActive ? "text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild>
            <Link href="/add-data" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Data
            </Link>
          </Button>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-10" />
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="text-xl font-bold text-primary">DataPricing</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted hover:bg-accent/50 hover:text-foreground"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
                <div className="py-6">
                  <Button asChild className="w-full">
                    <Link href="/add-data" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <Plus className="h-4 w-4" />
                      Add Data
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
