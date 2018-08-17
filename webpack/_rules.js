/**
 * Function to get all the webpack configuration rules for a component
 */
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const path = require('path');

function getComponentWebpackRules({ ExtractTextPlugin }) {
  let postcssPlugins = [
    cssnext({
      browsers: ['last 1 version'],
      warnForDuplicates: false
    })
  ];

  if (global.FOO_PROD) {
    postcssPlugins.push(cssnano());
  }

  return [
    {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'eslint-loader'
    },
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: 'babel-loader'
    },
    {
      test: /(\.css|\.scss|\.sass)$/i,
      include: [path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../node_modules/bulma')],
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: postcssPlugins
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      })
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    }
  ];
}
/**
 * Function to get all the webpack configuration rules for vendor files
 */
function getVendorWebpackRules(pluginsObj) {
  return getComponentWebpackRules(pluginsObj);
}

module.exports = {
  getComponentWebpackRules,
  getVendorWebpackRules
};
