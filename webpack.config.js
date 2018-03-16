var webpack = require('webpack');
var path = require('path');
var SRC_DIR = path.join(__dirname, '/client/src');
var DIST_DIR = path.join(__dirname, '/client/dist');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include : SRC_DIR,
        exclude: /node_modules/,
        loader : 'babel-loader',
        query : {
          presets : ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
      }
    ]
  }
};