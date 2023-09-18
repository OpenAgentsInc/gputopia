/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://github.com/mlc-ai/web-llm/issues/126#issuecomment-1617021764
  // Fixes npm packages that depend on `fs` module
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
        // by next.js will be dropped. Doesn't make much sense, but how it is
        fs: false, // the solution
        module: false,
        perf_hooks: false,
      };
    }
    return config
  },
}

module.exports = nextConfig
