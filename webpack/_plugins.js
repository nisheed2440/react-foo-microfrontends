/**
 * Function to get all the webpack configuration plugins for a component
 */
const fs = require('fs');
const path = require('path');

function getComponentWebpackPlugins({ ExtractTextPlugin, CleanWebpackPlugin }, { componentName, componentVersion }) {
  const componentPlugins = [
    new CleanWebpackPlugin([`../dist/modules/${componentName}/${componentVersion}`], { allowExternal: true }),
    new ExtractTextPlugin(`${componentName}.component.css`)
  ];
  return componentPlugins;
}

/**
 * Function to get all the webpack configuration plugins for vendor files
 */
function getVendorWebpackPlugins({ ExtractTextPlugin, CleanWebpackPlugin }) {
  const vendorPlugins = [new CleanWebpackPlugin([`../dist/vendor`], { allowExternal: true }), new ExtractTextPlugin(`[name].css`)];
  return vendorPlugins;
}

module.exports = {
  getComponentWebpackPlugins,
  getVendorWebpackPlugins
};
