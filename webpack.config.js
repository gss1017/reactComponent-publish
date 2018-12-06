const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const webpack = require('webpack');

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

const scriptRules = /\.(js|jsx)$/;
const styleRules = /\.(scss|css|less)$/;
const imageRules = /\.(png|jp[e]?g|gif|svg)/;

const staticAsset = '[name]_[hash:8].[ext]';

const scssLoaders = [
    {
        loader: 'css-loader',
        options: {
            // CSS Loader https://github.com/webpack/css-loader
            importLoaders: 2,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:4]', // 保留原始类名，以便数据上报
            minimize: false,
            discardComments: {removeAll: false},
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            config: {
                path: './postcss.config.js',
            },
        },
    },
    {
        loader: 'sass-loader',
    }
];
const cssLoaders = [
    {
        loader: 'css-loader',
        options: {
            // CSS Loader https://github.com/webpack/css-loader
            importLoaders: 1,
            modules: true, // 启用css 模块化
            localIdentName: '[name]_[local]_[hash:base64:4]',
            minimize: false,
            discardComments: {removeAll: false},
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            config: {
                path: './postcss.config.js',
            },
        },
    }
];

module.exports = {
    mode: 'development',
    entry: [
        './src/main.jsx'
    ],
    output: {
        filename: 'js/[name]_[hash].bundle.js',
        path: BUILD_PATH,
        chunkFilename: 'js/chunk-[name]_[chunkhash].js'
    },
    resolve: {
      extensions: ['.js', '.jsx'] // webpack 编译时自动补充后缀
    },
    module: {
      // 导出模块找不到 直接报错
      strictExportPresence: true,

      rules: [
          {
              test: scriptRules,
              include: SRC_PATH,
              loader: 'eslint-loader',
              enforce: 'pre'
          },
          {
              test: scriptRules,
              include: SRC_PATH,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                  cacheDirectory: true
              }
          },
          {
              test: styleRules,
              oneOf: [
                  {
                      test: /\.scss$/,
                      use: [
                          {loader: 'style-loader'},
                          ...scssLoaders
                      ]
                  },
                  {
                      test: /\.css$/,
                      include: SRC_PATH,
                      use: [
                          {loader: "style-loader"},
                          ...cssLoaders
                      ]
                  }
              ]
          },
          {
              test: imageRules,
              include: SRC_PATH,
              loader: "url-loader",
              options: {
                  name: 'image/' + staticAsset,
                  limit: 5 * 1024 // 单位：byte  超出limit设置的大小 调用file-loader
              }
          },
          {
              exclude: [
                  scriptRules,
                  styleRules,
                  imageRules,
                  /\.json$/, // webpack 4 已内置 json-loader，直接排除
                  /\.html$/
              ],
              use: {
                  loader: "file-loader",
                  options: {
                      name: staticAsset
                  }
              }
          }
      ]
    },
    bail: true,
    plugins: [
        new HtmlWebpackPlugin({
            title: 'hello react',
            filename: 'index.html',
            template: path.resolve(SRC_PATH, 'index.html')
        }),

        //放在htmlWebpackPlugin的后面才能生效
        new InlineManifestWebpackPlugin(), //将运行时代码直接插入html文件中，因为这段代码非常少，这样做可以避免一次请求的开销

        //热替换模块插件
        new webpack.NamedModulesPlugin(), // 打包模块新的命名规则 便于第三方包的缓存
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'cheap-module-inline-source-map',
    devServer: {
        contentBase: './',
        //clientLogLevel: 'info', // 打包log明细输出
        port: 5566,
        hot: true, // 写到命令行中（--hot） 发生热加载时页面会刷新 而且会报内存溢出错误
        historyApiFallback: true,
    },
    optimization: {
        runtimeChunk: 'single',
        // 分离 vendor 和 common，不再依赖 entry 手动指定 vendor
        splitChunks: {
            cacheGroups: {
                default: false, // 禁用所有缓存组
                vendor: {
                    test: /\/node_modules\//,
                    reuseExistingChunk: true,// 分割的代码块可以复用
                    chunks: 'all',
                    name: 'vendor',
                    priority: 1, // 该配置项是设置处理的优先级，数值越大越优先处理
                    minChunks: 1, // 至少被引用多少次后 才可以被分割进入当前 group
                    minSize: 30000
                }
            }
        },
        noEmitOnErrors: true
    }
};
