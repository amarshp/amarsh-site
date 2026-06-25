import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The NaN experience is the site's front door: serve the static poc at "/" (URL stays clean).
  // beforeFiles runs before the app router, so it takes precedence over src/app/page.tsx.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/poc-9-creature.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
