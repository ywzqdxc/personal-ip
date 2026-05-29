"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "./simple-icons"
import { useSound } from "@/hooks/use-sound"

const navItems = [
  { label: "Home",     href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Travel",   href: "/travel" },
  { label: "Blog",     href: "/blog" },
  { label: "Thoughts", href: "/thoughts" },
]

// 判断当前路由是否属于该 item
function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const { playSound } = useSound()

  // 深色全屏页面：导航透明浮动、始终可见、无 backdrop-blur
  const isTransparentNav =
    /^\/travel\/[^/]+\/[^/]+/.test(pathname ?? '') ||
    /^\/about\/hobby\/.+/.test(pathname ?? '') ||
    /^\/projects\/.+/.test(pathname ?? '')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = () => playSound("pop", 0.3)

  const navClass = isTransparentNav
    ? 'fixed top-0 left-0 right-0 z-50 transition-all duration-300'
    : `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isScrolled ? 'backdrop-blur-lg' : '-translate-y-full'
      }`

  const allItems = [...navItems, { label: "About", href: "/about" }]

  // 统一的导航项样式
  function navLinkStyle(href: string): React.CSSProperties {
    const active = isActive(href, pathname ?? '')
    const hovered = hoveredHref === href
    if (active) {
      return {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '6px 14px', borderRadius: '8px',
        background: '#C45A30', color: '#fff',
        fontSize: '13px', fontWeight: 600, textDecoration: 'none',
        lineHeight: 1, transition: 'background 0.2s',
      }
    }
    return {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '6px 10px', borderRadius: '8px',
      background: hovered ? 'rgba(196,90,48,0.10)' : 'transparent',
      color: hovered ? '#C45A30' : undefined,
      fontSize: '13px', fontWeight: 600, textDecoration: 'none',
      lineHeight: 1, transition: 'background 0.2s, color 0.2s',
    }
  }

  return (
    <>
      <nav className={navClass}>
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8" style={{ margin: '0 auto' }}>
          <div className="flex items-center justify-between h-16 md:h-20">
            <div />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {allItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  style={navLinkStyle(item.href)}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                >
                  {item.label}
                </Link>
              ))}
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
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {allItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { handleNavClick(); setIsMobileMenuOpen(false) }}
                style={{
                  fontSize: '22px', fontWeight: 600, textDecoration: 'none',
                  padding: '8px 24px', borderRadius: '10px',
                  background: isActive(item.href, pathname ?? '') ? '#C45A30' : 'transparent',
                  color: isActive(item.href, pathname ?? '') ? '#fff' : undefined,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
