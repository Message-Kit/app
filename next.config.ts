import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: {
        position: "bottom-right",
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
