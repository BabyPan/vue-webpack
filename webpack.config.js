const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')//一款webpack自动生成打包html的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
//const ExtractPlugin = require('extract-text-webpack-plugin@next')//除了js文件打包成单独文件(css)
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: 'web',
    entry: path.join(__dirname,'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname,'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()
    ]
}

if(isDev){
    config.module.rules.push({
        test: /\.styl$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                }
            },
            'stylus-loader'
        ]
    },)
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
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
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin
    )
} else {
    config.entry = {
        app: path.join(__dirname,'src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push({
        test: /\.styl/,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "stylus-loader",
        ]
    })
    config.plugins.push(
        // new ExtractPlugin('styles.[contenthash:8].css')
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash:8].css'
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'
        // })
        // new webpack.optimize.CommonsCchunkPlugin({
        //     name: 'runtime'
        // })
    )
    config.optimization = {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'vendor',
                    enforce: true,
                    chunks: 'initial',
                    minChunks: 2,
                }
            }
        }
    }
}

module.exports = config