import { Button } from "@/components/ui/button"
import { LinkedinIcon, InstagramIcon, YoutubeIcon, MailIcon } from "./simple-icons"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Let's Connect</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 text-balance leading-relaxed">
          I'm always interested in hearing about new opportunities in growth marketing, sustainability projects,
          agricultural innovation, or collaborations. Let's create something impactful together.
        </p>

        {/* Contact Methods */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button size="lg" asChild className="gap-2 min-w-[200px]">
            <a href="mailto:ritishverma9211helloji@gmail.com">
              <MailIcon className="w-5 h-5" />
              Send Email
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2 min-w-[200px] bg-transparent">
            <a href="https://www.linkedin.com/in/ritish-vermaji/" target="_blank" rel="noopener noreferrer">
              <LinkedinIcon className="w-5 h-5" />
              LinkedIn
            </a>
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-12 border-t border-border">
          <div className="flex items-center justify-center gap-6 mb-6">
            <a
              href="https://www.linkedin.com/in/ritish-vermaji/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/ritishverma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com/@ritishverma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-6 h-6" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Ritish Verma. All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}
