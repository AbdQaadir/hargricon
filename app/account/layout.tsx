import { AccountNav } from "./account-nav"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <AccountNav />
      <div className="mt-8">{children}</div>
    </div>
  )
}
