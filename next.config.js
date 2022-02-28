/** @type {import('next').NextConfig} */
/**
 *  eslint-disable
 */

const withPlugins = require("next-compose-plugins");

// 打包分析工具 开发调试时可注册在 plugins => const plugins = [withTM, withBundleAnalyzer];
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withTM = require("next-transpile-modules")([]);

const plugins = [withTM];

module.exports = withPlugins(plugins, {
  // swcMinify: true,
  // trailingSlash: true,
  productionBrowserSourceMaps: false,
  httpAgentOptions: {
    keepAlive: false,
  },
  devIndicators: {
    autoPrerender: true,
  },
  experimental: {
    outputStandalone: true,
    esmExternals: "loose",
  },
  cssModules: true,
  compress: false,
  isServer: false,
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config 可重写webpack配置
    return config;
  },

  async rewrites() {
    // const cloudurl = process.env.CLOUD_URL || "localhost:8080";
    const cloudURL = "localhost:8080";
    let r = [];
    if (process.env.NODE_ENV == "development") {
      // ⚠️ api顺序最上层优先
      r = [
        {
          source: "/watch",
          destination: `http://${cloudURL}/watch`,
        },
        {
          source: "/base/apis/:path*",
          destination: `http://${cloudURL}/base/apis/:path*`,
        },
        {
          source: "/aggregate/apis/:path*",
          destination: `http://${cloudURL}/aggregate/apis/:path*`,
        },
      ];
    }
    return r;
  },
});
