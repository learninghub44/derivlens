/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false },
  experimental: {},
};

export default nextConfig;

// Enables `wrangler.jsonc` bindings (env vars, KV, R2, etc.) to be
// available in `next dev` via `getCloudflareContext()`, matching what
// the Worker sees in production. No-op in production builds.
if (process.env.NODE_ENV === "development") {
  const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}
