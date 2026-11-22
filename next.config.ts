import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //property photos come from the OpenClassrooms S3 bucket (URLs given by the API)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-eu-west-1.amazonaws.com",
        pathname: "/course.oc-static.com/projects/front-end-kasa-project/**",
      },
    ],
  },
};

export default nextConfig;
