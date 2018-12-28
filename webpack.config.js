const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          options: {
            presets: ['@babel/preset-env']
          },
          loader: 'babel-loader'
        }
      }
    ]
  },
  devServer: {
    compress: true,
    port: 9000
  },
  plugins: [new MinifyPlugin()],
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
