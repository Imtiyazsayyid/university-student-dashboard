/** @type {import('next').NextConfig} */
const nextConfig = {
  // env: {
  //   BASE_URL:
  //     process.env.NODE_ENV === "production"
  //       ? "https://university-backend-gold.vercel.app/api/student"
  //       : "http://localhost:8003/api/student",
  // },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
