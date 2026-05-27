"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRightIcon } from "./simple-icons"
import { useState } from "react"
import { useSound } from "@/hooks/use-sound"

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  tags: string[]
}

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { playSound } = useSound()

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border-border ${
        featured ? "h-full" : "h-[400px]"
      }`}
      onMouseEnter={() => {
        setIsHovered(true)
        playSound("hover", 0.2)
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-90"
          }`}
        />

        {/* Content */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-primary font-medium mb-1">{project.subtitle}</p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">{project.title}</h3>
              </div>
              <ArrowUpRightIcon
                className={`text-primary transition-transform duration-300 w-6 h-6 ${
                  isHovered ? "translate-x-1 -translate-y-1" : ""
                }`}
              />
            </div>

            <p className="text-muted-foreground leading-relaxed text-pretty">{project.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
