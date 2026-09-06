/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Shared hub package (@ishub/site-kit) ships raw TS; Next must transpile it.
  transpilePackages: ["@ishub/site-kit"],
  // Static HTML export — deploy target is Cloudflare Pages, via a direct `wrangler`
  // upload of `out/` (no Node runtime on the host; see CLAUDE.md §10).
  output: "export",
  trailingSlash: true,
  images: {
    // No Next image-optimization server on static hosting.
    unoptimized: true,
    remotePatterns: [],
  },
};

export default nextConfig;
