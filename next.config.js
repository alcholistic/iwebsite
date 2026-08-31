const nextConfig = {
  // This configuration fixes the "Refused to connect" CSP errors
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; connect-src 'self' *.supabase.co ws://*.supabase.co wss://*.supabase.co;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
