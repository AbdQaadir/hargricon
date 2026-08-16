import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
