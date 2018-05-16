const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    index: './src/entry-index.js',
    perf: './src/entry-perf.js',
    logviewer: './src/entry-logviewer.js',
    userguide: './src/entry-userguide.js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 5,
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    // }),
  ],
}
