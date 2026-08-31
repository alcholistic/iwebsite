/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add headers to allow Supabase connections
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co; connect-src 'self' *.supabase.co ws://*.supabase.co wss://*.supabase.co;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
