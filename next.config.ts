/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // disables extra dev warnings

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://fairsplit-api.onrender.com/api/:path*", // Proxy to backend
        // destination: "http://localhost:8000/api/:path*", // Proxy to backend
      },
    ];
  },
};

module.exports = nextConfig;
