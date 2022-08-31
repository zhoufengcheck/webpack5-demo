const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const PATHS = {
  src: path.join(__dirname, 'src')
}

module.exports = {
  mode:"development",
  devtool: "source-map",
  entry: './src/index.js',  //入口
  entry: {
    entry1:'./src/entries/entry1.js',
    entry2:'./src/entries/entry2.js',
    entry3:'./src/entries/entry3.js',
  },
  output: {  //出口
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].bundle.js'
  },
  cache:{
    type:'filesystem'
  },
  module:{
    rules:[ 
      {
        test: /\.js$/,
        exclude: /(node_modules|public)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader', //不要和MiniCssExtractPlugin.loader一起使用
          'css-loader',
          'sass-loader'
        ],
      }, {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: './imgs/[hash][ext][query]'
        }
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        // 注意: priority属性
        // 其次: 打包业务中公共代码
        common: {
          name: "common",
          chunks: 'initial',
          minSize: 2,
          priority: 0,
          minChunks:2
        },
        // 首先: 打包node_modules中的文件
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10
        },
        async: {
          test: /node_modules/,
          name: 'async', 
          chunks: 'async',
          priority:100,
        }
      }
    }
  },
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'webpack',
      template: './public/entry1.html',
      filename: 'entry1.html',
      chunks:['entry1'],//会引用指定的js模块
      
    }),
    new HtmlWebpackPlugin({
      title: 'webpack',
      template: './public/entry2.html',
      filename: 'entry2.html',
      chunks:['entry2'],//会引用指定的js模块
      
    }),
    new HtmlWebpackPlugin({
      title: 'webpack',
      template: './public/entry3.html',
      filename: 'entry3.html',
      chunks:['entry3'],//会引用指定的js模块
      
    }),
    new CopyWebpackPlugin({
      patterns:[
        {
          from: path.join(__dirname,'public/css'),
          to: path.join(__dirname,'dist/css'),
        },
        {
          from: path.join(__dirname,'public/js'),
          to: path.join(__dirname,'dist/js'),  
        }
      ]
    }),
  ]
}