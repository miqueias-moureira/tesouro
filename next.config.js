/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // streaming será útil quando ligar respostas longas dos agentes
  },
};

module.exports = nextConfig;
