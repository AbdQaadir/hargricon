import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  )
}
