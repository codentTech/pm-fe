/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/boards", destination: "/projects", permanent: true },
      { source: "/boards/:id", destination: "/projects/:id", permanent: true },
    ];
  },
};

export default nextConfig;
