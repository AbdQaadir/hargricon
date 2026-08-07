import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SiteFooter } from "@/components/landing/site-footer"
import { StatStrip } from "@/components/landing/stat-strip"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <StatStrip />
      </main>
      <SiteFooter />
    </div>
  )
}
