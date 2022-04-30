const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './electron/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    fallback: {
      "stream": false,
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  plugins: [
    new NodePolyfillPlugin(),
  ]
};
