import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  experimental: {
    optimizePackageImports: [
      "@phosphor-icons/react",
      "recharts",
      "date-fns",
      "@base-ui/react",
      "sonner",
    ],
  },
}

export default nextConfig
