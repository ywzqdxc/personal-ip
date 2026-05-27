import { LinkedinIcon, InstagramIcon, YoutubeIcon } from "./simple-icons"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { HobbyCharacters } from "./hobby-characters"
import { IkigaiDiagram } from "./ikigai-diagram"

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
          {/* Text Content - 60% */}
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About Me</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p className="text-pretty">
                I'm a dynamic horticulturist, growth marketer, and multi-talented creator based in Solan, Himachal
                Pradesh. With a BSc (Hons.) in Horticulture from Dr. YS Parmar University, I merge agricultural insight,
                business acumen, and digital creativity—driving innovation across sectors.
              </p>
              <p className="text-pretty">
                Currently serving as Growth and Marketing Manager at Ridge Environment Consultants, I lead digital
                growth strategies, marketing campaigns, and innovative sustainability projects. My diverse experience
                spans from managing vertical farms and organic plantations to building websites and growing a YouTube
                channel to 128k+ subscribers.
              </p>
              <p className="text-pretty">
                I'm passionate about sustainable agriculture, digital marketing, content creation, and fitness. Whether
                it's planting 2000+ walnut seedlings, producing 40k worth of food products, or bench pressing 100kg, I
                bring the same dedication to everything I do. Selected for LinkedIn's RHWE Program, I'm committed to
                empowering communities through sustainable solutions.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://linkedin.com/in/ritishverma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <LinkedinIcon className="w-5 h-5" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://instagram.com/ritishverma" target="_blank" rel="noopener noreferrer" className="gap-2">
                  <InstagramIcon className="w-5 h-5" />
                  Instagram
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://youtube.com/@ritishverma" target="_blank" rel="noopener noreferrer" className="gap-2">
                  <YoutubeIcon className="w-5 h-5" />
                  YouTube (128k+)
                </a>
              </Button>
            </div>
          </div>

          {/* Profile Image - 40% */}
          <div className="md:col-span-2">
            <div className="relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-border shadow-2xl">
              <Image
                src="/images/design-mode/WhatsApp%20Image%202025-11-12%20at%203.09.57%20PM%20%281%29.jpeg"
                alt="Ritish Verma - Professional portrait"
                fill
                className="object-cover rounded-md"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-20 space-y-16">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12">
            <HobbyCharacters />
          </div>

          {/* Ikigai Venn Diagram */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12">
            <IkigaiDiagram />
          </div>
        </div>
      </div>
    </section>
  )
}
