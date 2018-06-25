import path from 'path'

import AssetsPlugin from 'assets-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

function getAssetName(assetType, useHash) {
  return `${assetType}/[name]${useHash ? '.[hash]' : ''}`
}

export default function config(env, argv) {
  const isDevelopment = argv.mode === 'development'
  const isProduction = argv.mode === 'production'

  const outputDir = path.join(__dirname, '../static')
  const manifestDir = path.join(__dirname, '../data')

  const result = {
    entry: {
      main: path.join(__dirname, 'src', 'index.js'),
      about: path.join(__dirname, 'src', 'about.js'),
    },

    output: {
      path: outputDir,
      filename: `${getAssetName('js', isProduction)}.js`,
    },

    resolve: {
      extensions: ['.js', '.jsx'],
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(['webpack_assets.json'], { root: manifestDir }),
      new MiniCssExtractPlugin({
        filename: `${getAssetName('css', isProduction)}.css`,
      }),
    ],

    devtool: isDevelopment ? '#inline-cheap-module-source-map' : false,
    watch: isDevelopment,
  }

  if (isDevelopment) {
    return result
  }

  result.plugins = result.plugins.concat([
    new CleanWebpackPlugin(['css', 'js'], { root: outputDir }),
    new OptimizeCSSAssetsPlugin(),
    new AssetsPlugin({
      path: manifestDir,
      filename: 'webpack_assets.json',
    }),
  ])
  return result
}
