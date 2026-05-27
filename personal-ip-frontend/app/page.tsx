import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDF6EE] pt-20 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <section className="py-20 md:py-32">
          <h1
            className="text-7xl md:text-9xl font-bold text-[#2E1A0E] leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            HELLO
            <br />
            WORLD
          </h1>
          <p className="text-[#B07050] mt-6 text-lg max-w-lg">
            Developer, traveler, thinker. Building things that matter,
            exploring places that inspire.
          </p>
        </section>

        {/* Bento 入口卡 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          <Link
            href="/projects"
            className="group block p-8 rounded-2xl border border-[#E8C9B0]/60 bg-[#2E1A0E]/[0.03] hover:bg-[#2E1A0E]/[0.06] hover:border-[#E8855A]/40 transition-all duration-300"
          >
            <h2
              className="text-3xl font-bold text-[#2E1A0E] group-hover:text-[#C45A30] transition-colors mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              PROJECTS
            </h2>
            <p className="text-[#B07050] text-sm">Things I've built. Open source, side projects, and more.</p>
            <span className="inline-block mt-4 text-[#E8855A] text-sm font-mono group-hover:translate-x-1 transition-transform">
              View all →
            </span>
          </Link>

          <Link
            href="/travel"
            className="group block p-8 rounded-2xl border border-[#E8C9B0]/60 bg-[#2E1A0E]/[0.03] hover:bg-[#2E1A0E]/[0.06] hover:border-[#E8855A]/40 transition-all duration-300"
          >
            <h2
              className="text-3xl font-bold text-[#2E1A0E] group-hover:text-[#C45A30] transition-colors mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              TRAVEL
            </h2>
            <p className="text-[#B07050] text-sm">Stories from the road. Places, people, moments.</p>
            <span className="inline-block mt-4 text-[#E8855A] text-sm font-mono group-hover:translate-x-1 transition-transform">
              Explore →
            </span>
          </Link>

          <Link
            href="/thoughts"
            className="group block p-8 rounded-2xl border border-[#E8C9B0]/60 bg-[#2E1A0E]/[0.03] hover:bg-[#2E1A0E]/[0.06] hover:border-[#E8855A]/40 transition-all duration-300"
          >
            <h2
              className="text-3xl font-bold text-[#2E1A0E] group-hover:text-[#C45A30] transition-colors mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              THOUGHTS
            </h2>
            <p className="text-[#B07050] text-sm">Random ideas, notes, and fragments.</p>
            <span className="inline-block mt-4 text-[#E8855A] text-sm font-mono group-hover:translate-x-1 transition-transform">
              Read →
            </span>
          </Link>

          <Link
            href="/about"
            className="group block p-8 rounded-2xl border border-[#E8C9B0]/60 bg-[#2E1A0E]/[0.03] hover:bg-[#2E1A0E]/[0.06] hover:border-[#E8855A]/40 transition-all duration-300"
          >
            <h2
              className="text-3xl font-bold text-[#2E1A0E] group-hover:text-[#C45A30] transition-colors mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              ABOUT
            </h2>
            <p className="text-[#B07050] text-sm">Who I am, what I do, and the team behind it all.</p>
            <span className="inline-block mt-4 text-[#E8855A] text-sm font-mono group-hover:translate-x-1 transition-transform">
              Learn more →
            </span>
          </Link>
        </section>
      </div>
    </main>
  )
}
