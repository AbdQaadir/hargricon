import { Logo } from "@/components/logo"

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <Logo className="mb-8" iconClassName="size-6" textClassName="text-lg" />

      {children}
    </div>
  )
}

export { AuthShell }
