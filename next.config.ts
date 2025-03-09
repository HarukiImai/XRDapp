import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Docker内でのホットリロードを有効にする設定
    config.watchOptions = {
      poll: 1000, // ポーリング間隔をミリ秒で指定
      aggregateTimeout: 300, // 変更後の再ビルドを遅延させる時間（ミリ秒）
      ignored: /node_modules/,
    };
    return config;
  },
};

export default nextConfig;
