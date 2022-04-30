const rules = require('./webpack.rules');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  resolve: {
    fallback: {
      "stream": false,
      "path": require.resolve("path-browserify"),
    },
    plugins: [new TsConfigPathsPlugin({ configFile: './tsconfig.json' })],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
