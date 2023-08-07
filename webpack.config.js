const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    plugin: './src/plugin.tsx',
    figma: './src/figma.ts', // This is the entry point for our plugin code.
  },
  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg/,
        type: 'asset/inline',
      },
    ],
  },
  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: {extensions: ['.tsx', '.ts', '.jsx', '.js']},
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      global: {}, // Fix missing symbol error when running in developer VM
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/plugin.html',
      filename: 'plugin.html',
      chunks: ['plugin'],
      cache: false,
    }),
    new HtmlInlineScriptPlugin({
      htmlMatchPattern: [/plugin.html/],
      scriptMatchPattern: [/.js$/],
    }),
  ],
  optimization: {
    minimize: argv.mode === 'production' ? true : false,
    minimizer: [new TerserPlugin()],
  },
});
