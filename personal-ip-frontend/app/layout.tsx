import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LenisProvider } from "@/components/lenis-provider"
import { ClickSpark } from "@/components/click-spark"
import { Navigation } from "@/components/navigation"
import { BackgroundAnimations } from "@/components/background-animations"
import { PixarCharacter } from "@/components/pixar-character"
import { WelcomeAudio } from "@/components/welcome-audio"
import { IntroVideo } from "@/components/intro-video"

export const metadata: Metadata = {
  title: "Personal IP — Portfolio & Travel",
  description: "个人 IP 网站 — 项目展示、旅行日记、随想碎片",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#FDF6EE] text-[#2E1A0E]">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LenisProvider>
            <ClickSpark sparkColor="#E8855A" sparkCount={8} sparkRadius={20}>
              <IntroVideo />
              <Navigation />
              <BackgroundAnimations />
              <PixarCharacter />
              <WelcomeAudio />
              {children}
            </ClickSpark>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
