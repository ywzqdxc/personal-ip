"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "./simple-icons"
import { useSound } from "@/hooks/use-sound"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Travel", href: "/travel" },
  { label: "Blog", href: "/blog" },
  { label: "Thoughts", href: "/thoughts" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { playSound } = useSound()

  // 深色全屏页面：导航透明浮动、始终可见、无 backdrop-blur
  // 包含：旅行日记详情页 + 所有 Hobby 子详情页
  const isTransparentNav =
    /^\/travel\/[^/]+\/[^/]+/.test(pathname ?? '') ||
    /^\/about\/hobby\/.+/.test(pathname ?? '')

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

  // 透明浮动模式：始终可见，无背景，无 blur
  const navClass = isTransparentNav
    ? 'fixed top-0 left-0 right-0 z-50 transition-all duration-300'
    : `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isScrolled ? 'backdrop-blur-lg' : '-translate-y-full'
      }`

  return (
    <>
      <nav className={navClass}>
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
              <Link
                href="/about"
                onClick={handleNavClick}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '6px 14px', borderRadius: '8px',
                  background: '#C45A30', color: '#fff',
                  fontSize: '13px', fontWeight: 600, textDecoration: 'none',
                  marginLeft: '16px', lineHeight: 1,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#A8491E')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#C45A30')}
              >
                About
              </Link>
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
            <Link
              href="/about"
              onClick={() => { handleNavClick(); setIsMobileMenuOpen(false) }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px 28px', borderRadius: '8px',
                background: '#C45A30', color: '#fff',
                fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                marginTop: '16px', lineHeight: 1,
              }}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
