/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // CSP: zaczynamy od REPORT-ONLY, żeby niczego nie zablokować i nie zepsuć.
    // Gdy zobaczysz, co raportuje, można przejść na twarde CSP (albo nonce).
    const cspReportOnly = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data: https:",
      "font-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https:",
      "script-src 'self' 'unsafe-inline' https:",
      "connect-src 'self' https:",
      "frame-src 'self' https:",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          // 1) Podstawy wymagane przez większość skanerów
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" }, // lub SAMEORIGIN jeśli gdzieś osadzasz własną stronę w iframe
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), payment=(), usb=()",
          },

          // 2) CSP (na start Report-Only)
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },

          // 3) Dodatkowe (bezpieczne, rzadko psują)
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },

          // 4) Opcjonalnie: COOP (zwykle OK)
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },

          // 5) Jeśli SecurityHeaders marudzi o CORS "*", ustawiamy jawnie (opcjonalne):
          //    Uwaga: to ma sens głównie dla API / fetch. Dla HTML i tak nie ma znaczenia,
          //    ale skanery to lubią.
          { key: "Access-Control-Allow-Origin", value: "https://www.wawerpolisy.pl" },
          { key: "Vary", value: "Origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
