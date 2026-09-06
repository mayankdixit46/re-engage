import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/re-engage" : "",
  assetPrefix: isProd ? "/re-engage/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
