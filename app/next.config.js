const withSourceMaps = require('@zeit/next-source-maps')
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');

module.exports = {
  env: {
    //expose base url to code running client side.
    BASE_URL: process.env.BASE_URL
  },
  ...withSass(withCss(withSourceMaps({
    webpack: function (config) {
      config.module.rules.push({
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]'
          }
        }
      })
      return config
    }
  })))
}