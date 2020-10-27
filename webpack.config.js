const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// JavaScript rule: what to do with .js files
const javascript = {
  test: /\.(js)$/, // match anything that ends in `.js`
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: { presets: ['@babel/preset-env'] },
  },
};

// postCSS loader, fed into the next loader
const postcss = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [autoprefixer()],
    },
  },
};

// sass/css loader: handles require('something.scss')
const styles = {
  test: /\.(scss)$/,
  // here is how to use the MiniCssExtractPlugin
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: process.env.NODE_ENV === 'development',
      },
    },
    'css-loader?sourceMap',
    postcss,
    'sass-loader?sourceMap',
  ],
};

// use plugins
const uglifyJS = new UglifyJsPlugin({
  cache: true,
  parallel: true,
  uglifyOptions: {
    compress: true,
    ecma: 6,
    mangle: true,
  },
  sourceMap: true,
});

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
    path: path.resolve(__dirname, 'public', 'dist'),
    // use substitutions in file name (name will be `App`, name of the entry)
    filename: '[name].bundle.js',
  },
  // optimization key for the uglify plugin
  optimization: {
    minimizer: [uglifyJS, new OptimizeCSSAssetsPlugin({})],
  },
  // pass the rules for JS and styles
  module: {
    rules: [javascript, styles],
  },
  // pass an array of plugins
  plugins: [
    // output css to a separate file
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};

// shhhhhhh
process.noDeprecation = true;

module.exports = config;
