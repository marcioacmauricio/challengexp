const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
          test: /\.scss$/,
          use: [
              {
                  loader: 'style-loader'
              },
              {
                  loader: 'css-loader'
              },
              {
                  loader: 'sass-loader',
              }
          ]
      },
      {
          test: /\.css$/,
          use: [
              {
                  loader: 'style-loader'
              },
              {
                  loader: 'css-loader'
              }
          ]
      }
    ]
  },
  plugins: [htmlWebpackPlugin]
};

