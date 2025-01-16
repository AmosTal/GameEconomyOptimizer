const webpack = require('webpack');
const { override, addWebpackPlugin } = require('customize-cra');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = override(
  // Terser optimization
  (config) => {
    config.optimization = {
      ...config.optimization,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              pure_funcs: ['console.log'],
            },
            mangle: true,
          },
          parallel: true,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
          },
        },
      },
    };
    return config;
  },

  // Compression Plugin
  addWebpackPlugin(
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    })
  ),

  // Performance hints
  (config) => {
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };
    return config;
  },

  // Environment-based optimizations
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.REACT_APP_PERFORMANCE_LOGGING': JSON.stringify(false),
    })
  ),

  // Optional: Bundle size analyzer (uncomment when needed)
  // addWebpackPlugin(new BundleAnalyzerPlugin())
);
