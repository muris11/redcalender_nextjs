const nextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hlmrzoauwwuswlvpfuqw.supabase.co",
      },
      {
        protocol: "https",
        hostname: "rsud.bulelengkab.go.id",
      },
    ],
  },
};

export default nextConfig;
