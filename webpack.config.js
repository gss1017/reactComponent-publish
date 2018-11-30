const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    mode: 'development',
    entry: '.src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      extensions: ['.js', '.jsx'] // webpack 编译时自动补充后缀
    },
    module: {
      rules: [
          {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                  cacheDirectory: true
              }
          },
          {
              test: '/\.css&/'
          }
      ]
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        clientLogLevel: 'info',
        hot: true,
        port: 3001,
        progress: true
    }
};