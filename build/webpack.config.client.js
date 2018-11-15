const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')//一款webpack自动生成打包html的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')//除了js文件打包成单独文件(css)
const isDev = process.env.NODE_ENV === 'development'
const baseConfig = require('./webpack.config.base')

const defaultPluins = [
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
      'process.env': {
          NODE_ENV: isDev ? '"development"' : '"production"'
      }
  }),
  new HTMLPlugin()
]

const devServer = {
  port: '8000',
  host: '0.0.0.0',
  overlay: {
      errors: true,
  },
  // historyFallback: {

  // },
  hot: true,
  open: true
}

let config

if(isDev){
    config = merge(baseConfig, {
      devtool: '#cheap-module-eval-source-map',
      module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    'stylus-loader'
                ]
            },
        ]
      },
      devServer,
      plugins: defaultPluins.concat([
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoEmitOnErrorsPlugin
      ])
    })
} else {
    config = merge(baseConfig, {
      entry: {
          app: path.join(__dirname,'../client/index.js'),
          // vendor: ['vue']
      },
      output: {
        filename: '[name].[chunkhash:8].js'
      },
      plugins: defaultPluins.concat([
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash:8].css'
        }),
      ]),
      module: {
        rules: [
          {
              test: /\.styl(us)?$/,
              use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader",
                  "stylus-loader",
              ]
          },
          {
            test: /\.css$/,
              use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader",
              ]
          }
        ]
      },
      optimization: {
        splitChunks: {
            chunks: 'all'
            // cacheGroups: {
            //     commons: {
            //         name: 'vendor',
            //         enforce: true,
            //         chunks: 'all',
            //         minChunks: 2,
            //     }
            // }
        },
        runtimeChunk: true
      }
    })
}

module.exports = config
