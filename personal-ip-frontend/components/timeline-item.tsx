"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface TimelineItemProps {
  item: {
    period: string
    title: string
    company: string
    description: string
    achievements: string[]
    skills: string[]
  }
  index: number
}

export function TimelineItem({ item, index }: TimelineItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const isEven = index % 2 === 0

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={`relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className={`flex items-center gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
        {/* Content Card */}
        <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"} ml-12 md:ml-0`}>
          <Card className="p-6 md:p-8 border-border hover:border-primary transition-colors duration-300">
            <p className="text-sm text-primary font-medium mb-2">{item.period}</p>
            <h3 className="text-2xl font-bold tracking-tight mb-1">{item.title}</h3>
            <p className="text-lg text-muted-foreground mb-4">{item.company}</p>
            <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">{item.description}</p>

            {/* Achievements */}
            <ul className={`space-y-2 mb-4 ${isEven ? "md:text-right" : "md:text-left"}`}>
              {item.achievements.map((achievement, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="flex-1 text-pretty">{achievement}</span>
                </li>
              ))}
            </ul>

            {/* Skills */}
            <div className={`flex flex-wrap gap-2 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
              {item.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Timeline Dot */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg" />

        {/* Spacer for alignment */}
        <div className="hidden md:block flex-1" />
      </div>
    </div>
  )
}
