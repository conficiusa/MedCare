/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xgyzgqc7wzq7cyz6.public.blob.vercel-storage.com",
        port: "",
        pathname: "/profiles/**",
      },
    ],
  },
};

export default nextConfig;
