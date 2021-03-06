const path = require('path')

module.exports = {
  target: 'node',
  entry: './src/index.js',
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  }
}
