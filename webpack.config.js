const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    mode: 'development',
    entry: path.resolve(SRC_PATH, 'index.jsx'),
    output: {
        filename: 'js/[name].bundle.js',
        path: BUILD_PATH
    },
    resolve: {
      extensions: ['.js', '.jsx'] // webpack 编译时自动补充后缀
    },
    module: {
      // 导出模块找不到 直接报错
      strictExportPresence: true,

      rules: [
          {
              test: /\.(js|jsx)$/,
              include: SRC_PATH,
              loader: 'eslint-loader',
              enforce: 'pre'
          },
          {
              test: /\.(js|jsx)$/,
              include: SRC_PATH,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                  cacheDirectory: true
              }
          }
      ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'hello react',
            filename: 'index.html',
            template: path.resolve(SRC_PATH, 'index.html')
        }),

        //热更新插件
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'cheap-module-inline-source-map',
    devServer: {
        clientLogLevel: 'info',
        hot: true,
       // hotOnly: true,
        port: 5566,
        progress: true,
        historyApiFallback: true,
        open: 'http://localhost:5566'
    }
};