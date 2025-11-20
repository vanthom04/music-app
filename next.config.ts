import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "9b2fomoly8.ufs.sh" }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb"
    }
  }
}

export default nextConfig
