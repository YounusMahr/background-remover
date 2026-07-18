import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            // "credentialless" keeps cross-origin isolation (SharedArrayBuffer /
            // WASM threads for @imgly/background-removal) while still allowing
            // third-party scripts like Google AdSense to load.
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
