import path from 'path';
import StatsPlugin from 'stats-webpack-plugin';

module.exports = {
  entry: {
    app: './example/src/index.js'
  },

  output:{
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },

  devtool: 'source-map',

  resolve: {
    alias: {
      'react-router-server': path.join(__dirname, '..', 'src')
    }
  },

  module: {
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  plugins: [
    new StatsPlugin('stats.json')
  ]
};
