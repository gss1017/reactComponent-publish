const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
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
    mode: 'production',
    entry: path.resolve(SRC_PATH, 'main.jsx'),
    output: {
        filename: 'js/[name]_[chunkhash].js',
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
                          MiniCssExtractPlugin.loader,
                          ...scssLoaders
                      ]
                  },
                  {
                      test: /\.css$/,
                      include: SRC_PATH,
                      use: [
                          MiniCssExtractPlugin.loader,
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
            hash: true, //防止缓存
            template: path.resolve(SRC_PATH, 'index.html'),
            minify: {
                removeAttributeQuotes:true // 压缩 去掉引号
            }
        }),

        new InlineManifestWebpackPlugin(), //将运行时代码直接插入html文件中，因为这段代码非常少，这样做可以避免一次请求的开销

        new MiniCssExtractPlugin({
            filename: 'css/[name]_[contenthash].css',
            chunkFilename: 'css/[name]_[contenthash].css'
        }),

        new WebpackParallelUglifyPlugin({ // 并行压缩
            uglifyJS: {
                output: {
                    beautify: false, //不需要格式化
                    comments: false //不保留注释
                },
                compress: {
                    warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                    drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
                    collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                    reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
                }
            }
        }),
        // 自定义js优化配置，将会覆盖默认配置
        // new UglifyJsPlugin({
        //     exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        //     cache: true,
        //     parallel: true, // 开启并行压缩，充分利用cpu
        //     sourceMap: false,
        //     extractComments: false, // 移除注释
        //     uglifyOptions: {
        //         compress: {
        //             unused: true,
        //             warnings: false,
        //             drop_debugger: true
        //         },
        //         output: {
        //             comments: false
        //         }
        //     }
        // }),
        // 用于优化css文件
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: styleRules,
            cssProcessorOptions: {
                safe: true,
                autoprefixer: { disable: true }, // 这里是个大坑，稍后会提到
                mergeLonghand: false,
                discardComments: {
                    removeAll: true // 移除注释
                }
            },
            canPrint: true
        }),

        new webpack.HashedModuleIdsPlugin(), // 根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境
        // new webpack.NamedChunksPlugin((chunk) => {
        //     console.log('-----ccccccc', Array.from(chunk.modulesIterable));
        //     if (chunk.name) {
        //         return chunk.name;
        //     }
        //     // const modules = Array.from(chunk.modulesIterable);
        //     // if (modules.length > 1) {
        //     //     const joinedHash = hashSum(modules.map(m => m.id).join('_'));
        //     //     let len = nameLength;
        //     //     while (seen.has(joinedHash.substr(0, len))) len++;
        //     //     seen.add(joinedHash.substr(0, len));
        //     //     return `chunk-${joinedHash.substr(0, len)}`;
        //     // } else {
        //     //     return modules[0].id;
        //     // }
        // })
    ],
    devtool: 'cheap-module-inline-source-map',
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
