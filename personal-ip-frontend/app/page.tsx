"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import projectsData from "@/data/projects.json"
import { getTravelYears } from "@/lib/travel/mock-data"
import { HeroGallery } from "@/components/hero-gallery"

/* ── Types ─────────────────────────────────── */
interface Project {
  id: string
  title: string
  subtitle?: string
  description: string
  image?: string
  tags: string[]
  category: string
  featured?: boolean
}

/* ── Data ──────────────────────────────────── */
const featuredProjects = (projectsData as Project[])
  .filter((p) => p.featured)
  .slice(0, 3)

const travelYears = getTravelYears()
const latestTrip = travelYears[0]?.trips[0]

/* ── Shared animation config ───────────────── */
const lensReveal = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const },
}

/* ══════════════════════════════════════════════
   LENS 1 — HERO
   ══════════════════════════════════════════════ */
function HeroLens() {
  return <HeroGallery />
}

function _HeroLensOld() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, #1A0C06 0%, #3D2010 35%, #7A3A1E 68%, #C45A30 100%)",
      }}
    >
      {/* 噪点纹理 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.045,
        }}
      />

      {/* 右下光晕 */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          bottom: "-5%",
          width: "55vw",
          height: "55vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,90,48,0.18) 0%, transparent 65%)",
        }}
      />

      {/* ── 顶部元信息栏 ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative z-10 flex items-center justify-between px-8 md:px-16 pt-32"
      >
        <span
          className="text-[#E8C9B0]/40 text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Personal Portfolio
        </span>
        <span
          className="text-[#E8C9B0]/40 text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          2026
        </span>
      </motion.div>

      {/* ── 主名称区 ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 pb-8">

        {/* 小标签 */}
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[#E8855A]/80 text-xs tracking-[0.25em] uppercase mb-6"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          ·&nbsp;&nbsp;Hello, I&rsquo;m
        </motion.p>

        {/* 姓名 — 主视觉 */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(5rem, 15vw, 15rem)",
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: "-0.01em",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            CUI XIN
          </motion.h1>
        </div>

        {/* 分隔线 + 角色标签 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0"
        >
          {/* 左侧横线 */}
          <div
            className="hidden sm:block shrink-0 mr-6"
            style={{ width: 48, height: 1, background: "rgba(232,197,176,0.35)" }}
          />

          {/* 角色 */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {["Developer", "Traveler", "Thinker"].map((role, i) => (
              <span key={role} className="flex items-center gap-5">
                <span
                  className="text-[#F5D0B8]/85 text-sm md:text-base tracking-widest uppercase"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.2em" }}
                >
                  {role}
                </span>
                {i < 2 && (
                  <span className="text-[#C45A30]/50 text-xs">·</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 简介句 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-5 text-[#E8C9B0]/45 text-sm max-w-sm leading-relaxed"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Building things that matter,<br />exploring places that inspire.
        </motion.p>
      </div>

      {/* ── 底部 Scroll 提示 ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="relative z-10 pb-10 flex justify-center"
      >
        <div className="flex flex-col items-center gap-3 text-[#E8C9B0]/40 text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#E8C9B0]/0 via-[#E8C9B0]/40 to-[#E8C9B0]/0"
          />
          <span>Scroll</span>
        </div>
      </motion.div>
    </motion.section>
  )
}

/* ══════════════════════════════════════════════
   LENS 2 — PROJECTS
   ══════════════════════════════════════════════ */
function ProjectsLens() {
  const categories = [
    { key: "tech", label: "TECH", color: "text-[#C45A30]" },
    { key: "agriculture", label: "AGRICULTURE", color: "text-[#8B6B4A]" },
    { key: "creative", label: "CREATIVE", color: "text-[#6B8B7A]" },
  ]

  return (
    <motion.section
      {...lensReveal}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-[#FDF6EE]"
    >
      <div className="max-w-6xl w-full">
        <div className="mb-16 text-center">
          <p className="text-[#C45A30] tracking-[0.3em] uppercase text-xs mb-4">
            Lens 02
          </p>
          <h2
            className="text-5xl md:text-7xl font-bold text-[#2E1A0E]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            PROJECTS
          </h2>
          <p className="text-[#B07050] mt-3 max-w-md mx-auto">
            Selected work across technology, agriculture, and creative domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project, i) => {
            const cat = categories.find((c) => c.key === project.category)
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.15 * i,
                    duration: 0.7,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="relative overflow-hidden rounded-2xl border border-[#E8C9B0]/60 bg-white/60 hover:bg-white hover:border-[#E8855A]/40 hover:shadow-lg hover:shadow-[#E8C9B0]/20 transition-all duration-500"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#E8C9B0]/20">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#B07050]/30 text-6xl">
                        {project.title.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {cat && (
                      <span
                        className={`inline-block text-[10px] tracking-[0.2em] uppercase font-semibold mb-2 ${cat.color}`}
                      >
                        {cat.label}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-[#2E1A0E] mb-1 group-hover:text-[#C45A30] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[#B07050] text-sm line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8C9B0]/30 text-[#8B6B4A]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[#C45A30] hover:text-[#E8855A] transition-colors text-sm font-mono group"
          >
            View all projects
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

/* ══════════════════════════════════════════════
   LENS 3 — TRAVEL
   ══════════════════════════════════════════════ */
function TravelLens() {
  if (!latestTrip) return null

  return (
    <motion.section
      {...lensReveal}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden"
      style={{ background: "#1A0E08" }}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url(${latestTrip.coverImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px) saturate(0.6)",
        }}
      />

      <div className="relative z-10 max-w-4xl w-full text-center">
        <p className="text-[#C45A30] tracking-[0.3em] uppercase text-xs mb-4">
          Lens 03
        </p>
        <h2
          className="text-5xl md:text-7xl font-bold text-[#FDF6EE] mb-4"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          TRAVEL
        </h2>
        <p className="text-[#B07050] mb-16 max-w-md mx-auto">
          Stories from the road. Places, people, moments captured on film.
        </p>

        <Link href={`/travel/${latestTrip.year}/${latestTrip.id}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/10 hover:border-[#C45A30]/50 transition-all duration-500 group cursor-pointer max-w-2xl mx-auto"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={latestTrip.coverImg}
                alt={latestTrip.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E08] via-[#1A0E08]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
              <p className="text-[#E8855A] text-sm tracking-[0.2em] uppercase mb-2">
                {latestTrip.subtitle}
              </p>
              <h3
                className="text-4xl md:text-6xl font-bold text-white mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {latestTrip.title}{" "}
                <span className="text-[#E8C9B0]/60 text-2xl">
                  {latestTrip.titleYear}
                </span>
              </h3>
              <p className="text-[#F5D0B8]/80 text-sm italic max-w-md">
                {latestTrip.tagline?.replace(/\n/g, " ")}
              </p>
              <p className="text-[#C45A30] text-xs mt-3 font-mono group-hover:translate-x-1 transition-transform inline-block">
                Read journal →
              </p>
            </div>
          </motion.div>
        </Link>

        <div className="flex justify-center gap-4 mt-10 flex-wrap">
          {travelYears.slice(0, 4).map((y) => (
            <Link
              key={y.year}
              href={`/travel/${y.year}`}
              className="px-5 py-2 rounded-full border border-white/15 text-[#E8C9B0]/70 hover:text-[#E8855A] hover:border-[#C45A30]/50 text-sm transition-all duration-300"
            >
              {y.year}
            </Link>
          ))}
          <Link
            href="/travel"
            className="px-5 py-2 rounded-full border border-[#C45A30]/40 text-[#E8855A] text-sm transition-all duration-300 hover:bg-[#C45A30]/10"
          >
            All trips →
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

/* ══════════════════════════════════════════════
   LENS 4 — THOUGHTS
   ══════════════════════════════════════════════ */
const thoughtFragments = [
  { text: "The best code is the one you don't write.", mood: "code" },
  { text: "凌晨四点的布罗莫火山口，星辰比代码更密集。", mood: "travel" },
  { text: "Why do we optimize for machines when we build for humans?", mood: "code" },
  { text: "巴厘岛的咖啡是甜的，像被海风腌过的椰子糖。", mood: "travel" },
  { text: "Simplicity is the ultimate sophistication.", mood: "design" },
  { text: "跑步时想到的解决方案，往往比坐在屏幕前更好。", mood: "life" },
]

function ThoughtsLens() {
  return (
    <motion.section
      {...lensReveal}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-[#FDF6EE]"
    >
      <div className="max-w-4xl w-full">
        <div className="mb-16 text-center">
          <p className="text-[#C45A30] tracking-[0.3em] uppercase text-xs mb-4">
            Lens 04
          </p>
          <h2
            className="text-5xl md:text-7xl font-bold text-[#2E1A0E]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            THOUGHTS
          </h2>
          <p className="text-[#B07050] mt-3 max-w-md mx-auto">
            Random ideas, notes, and fragments — scattered across time and place.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {thoughtFragments.map((fragment, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.08 * i,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="break-inside-avoid p-5 rounded-2xl border border-[#E8C9B0]/50 bg-white/60 hover:bg-white hover:border-[#E8855A]/30 transition-all duration-300"
            >
              <p className="text-[#2E1A0E]/80 text-sm leading-relaxed italic">
                &ldquo;{fragment.text}&rdquo;
              </p>
              <span className="inline-block mt-3 text-[10px] tracking-[0.15em] uppercase text-[#B07050]/60">
                {fragment.mood}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/thoughts"
            className="inline-flex items-center gap-2 text-[#C45A30] hover:text-[#E8855A] transition-colors text-sm font-mono group"
          >
            Browse all thoughts
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

/* ══════════════════════════════════════════════
   LENS 5 — FOOTER
   ══════════════════════════════════════════════ */
function FooterLens() {
  return (
    <motion.section
      {...lensReveal}
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24"
      style={{ background: "#2E1A0E" }}
    >
      <div className="text-center max-w-lg">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[#C45A30] tracking-[0.3em] uppercase text-xs mb-8"
        >
          Lens 05 — Fin
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-[#FDF6EE] mb-6"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Let&rsquo;s build
          <br />
          something together.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-[#B07050] text-sm leading-relaxed mb-10"
        >
          Always open to interesting conversations,
          <br />
          collaborations, and coffee.
        </motion.p>


        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-16 text-[#E8C9B0]/30 text-xs"
        >
          &copy; 2026 Cui Xin. Made with passion.
        </motion.p>
      </div>
    </motion.section>
  )
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function Home() {
  return (
    <main>
      <HeroLens />
      <ProjectsLens />
      <TravelLens />
      <ThoughtsLens />
      <FooterLens />
    </main>
  )
}
