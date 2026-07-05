import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for classic cPanel hosting (public_html + contact.php).
  output: "export",
};

export default nextConfig;
