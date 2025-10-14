/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://fairsplit-api.onrender.com/api/:path*", // Proxy to backend
      },
    ];
  },
};

module.exports = nextConfig;
