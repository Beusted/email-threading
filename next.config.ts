import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parent tree is a git repo containing a home directory, so Next's
  // automatic workspace-root inference picks the wrong root. Pin it here.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
