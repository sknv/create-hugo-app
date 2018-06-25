import path from 'path'

import AssetsPlugin from 'assets-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

// Add hash to asset name for production.
function getAssetName(assetType) {
  return `${assetType}/[name].[hash]`
}

export default function config(env, argv) {
  const isDevelopment = argv.mode === 'development',
    isProduction = argv.mode === 'production'

  const outputPath = path.join(__dirname, '../static')

  const result = {
    entry: {
      main: path.join(__dirname, 'src', 'index.js')
    },

    output: {
      path: outputPath,
      filename: `${getAssetName('js')}.js`
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },

    plugins: [
      new CleanWebpackPlugin(['css', 'js'], { root: outputPath }),

      new MiniCssExtractPlugin({
        filename: `${getAssetName('css')}.css`
      }),

      new AssetsPlugin({
        path: path.join(__dirname, '../data'),
        filename: 'webpack_assets.json'
      })
    ],

    devtool: isDevelopment ? '#inline-cheap-module-source-map' : false,
    watch: isDevelopment
  }

  if (isDevelopment) {
    return result
  }

  result.plugins.push(new OptimizeCSSAssetsPlugin())
  return result
}
