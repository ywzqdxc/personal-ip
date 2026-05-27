"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InstagramIcon } from "./simple-icons"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useSound } from "@/hooks/use-sound"

const galleryImages = [
  {
    id: 1,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-12%20at%203.09.57%20PM-hgTcEqrgqHZ5xljXFMyxPOiwR11fg3.jpeg",
    alt: "Ritish at the pool",
  },
  {
    id: 2,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-12%20at%203.09.58%20PM-FM3p2ADw2qnLGblTWwNykK3Wm4nDpy.jpeg",
    alt: "Mandatory pose at the restaurant",
  },
  {
    id: 3,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-12-12%20at%2001.21.44-af33qV6S0AL4TJnpmkU2ilNY2kDc8P.jpg",
    alt: "Nature moment with horses",
  },
  {
    id: 4,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-12-12%20at%2001.21.53%20%282%29-GXZHDsmNz2ZjcVYVKrKumaosmgPxmS.jpg",
    alt: "Adventure climbing on rocks",
  },
  {
    id: 5,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-12-12%20at%2001.21.52-RYyGp7Aj6RNdrMlS3yxcbYEX1YKx3m.jpg",
    alt: "Mountain adventure with donkey",
  },
  {
    id: 6,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-12-12%20at%2001.21.57-Gg5VtrbTI1G54GPEZzphDBHZ5kZ85B.jpg",
    alt: "Horticulture work at research site",
  },
]

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { playSound } = useSound()

  return (
    <section id="gallery" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Life & Moments</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 text-balance">
            Capturing inspiration from everyday life, travels, and creative explorations
          </p>
          <Button variant="outline" size="lg" asChild className="gap-2 bg-transparent">
            <a href="https://www.instagram.com/laughiosaurr/" target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="w-5 h-5" />
              Follow on Instagram
            </a>
          </Button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image) => (
            <Card
              key={image.id}
              className="group relative aspect-square overflow-hidden cursor-pointer bg-secondary/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300"
              onClick={() => {
                setSelectedImage(image.src)
              }}
              onMouseEnter={() => playSound("hover")}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
            </Card>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0">
          {selectedImage && (
            <div className="relative aspect-square w-full">
              <Image src={selectedImage || "/placeholder.svg"} alt="Gallery image" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
