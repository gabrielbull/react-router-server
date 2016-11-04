const webpack = require('webpack');
const path = require('path');

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
        loader: 'babel',
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
  ]
};
