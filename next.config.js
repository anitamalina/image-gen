const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  publicRuntimeConfig: {
    apiKey: process.env.OPENAI_API_KEY,
  },
};

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
