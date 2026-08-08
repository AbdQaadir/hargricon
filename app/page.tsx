import {
  ClosingCta,
  Features,
  Hero,
  HowItWorks,
  SiteFooter,
  SiteHeader,
  StatStrip,
} from "@/components/landing"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <StatStrip />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  )
}
