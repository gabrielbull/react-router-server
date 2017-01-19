const webpack = require('webpack');
const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  entry: {
    app: path.join(__dirname, 'app.js')
  },

  output:{
    path: path.join(__dirname),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },

  target: 'node',

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: []
        }
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        babel: {
          babelrc: false,
        }
      }
    }),
    new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules/]
    })
  ]
};
