"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MenuIcon, XIcon } from "./simple-icons"
import { Button } from "@/components/ui/button"
import { useSound } from "@/hooks/use-sound"

const navItems = [
  { label: "Home", href: "/" },
  
  { label: "Projects", href: "/projects" },
  { label: "Travel", href: "/travel" },
  { label: "Blog", href: "/blog" },
  { label: "Thoughts", href: "/thoughts" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { playSound } = useSound()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = () => {
    playSound("pop", 0.3)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          !isScrolled ? "backdrop-blur-lg" : "-translate-y-full"
        }`}
      >
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8" style={{ margin: '0 auto' }}>
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
              onClick={handleNavClick}
            >
              Portfolio
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-bold"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild size="sm" className="ml-4">
                <Link href="/about" onClick={handleNavClick}>
                  About
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                playSound("pop", 0.3)
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  handleNavClick()
                  setIsMobileMenuOpen(false)
                }}
                className="text-2xl font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="lg" className="mt-4">
              <Link
                href="/about"
                onClick={() => {
                  handleNavClick()
                  setIsMobileMenuOpen(false)
                }}
              >
                About
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
