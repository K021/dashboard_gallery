import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    // domains 설정은 외부 URL에만 필요
    // 정적 파일은 /public에서 바로 제공되므로 생략 가능
  },
};

export default nextConfig;
