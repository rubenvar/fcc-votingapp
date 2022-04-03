require('dotenv').config();
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isDevMode = process.env.NODE_ENV === 'development';
console.log(isDevMode);

// JavaScript rule: what to do with .js files
const javascript = {
  test: /\.(js)$/, // match anything that ends in `.js`
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: { presets: ['@babel/preset-env'] },
  },
};

// sass/css loader: handles require('something.scss')
const styles = {
  test: /\.(scss)$/,
  // here is how to use the MiniCssExtractPlugin
  use: [
    isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [autoprefixer()],
        },
      },
    },
    'sass-loader',
  ],
};

// put it all together
const config = {
  entry: {
    // only 1 entry
    App: './public/javascripts/votingapp-app.js',
  },
  // which kind of sourcemap to use
  devtool: 'source-map',
  // kick everything out to a file
  output: {
    path: path.resolve(__dirname, 'public', isDevMode ? 'dev' : 'dist'),
    // use substitutions in file name (name will be `App`, name of the entry)
    filename: '[name].bundle.js',
  },
  // target: ['web', 'es5'],
  target: 'web',
  // pass the rules for JS and styles
  module: {
    rules: [javascript, styles],
  },
  // optimization key for the uglify plugin
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  // pass an array of plugins
  plugins: [
    // output css to a separate file
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};

module.exports = config;
