require('./_cli');
const rules = require('./_rules');
const plugins = require('./_plugins');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');
const glob = require('glob');
const Table = require('cli-table');
const del = require('del');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const _ = require('lodash');
const NAMESPACE = 'FOO';
const pluginsObj = {
  ExtractTextPlugin,
  CleanWebpackPlugin,
  UglifyJsPlugin
};

/**
 * Function to delete files and folders
 * @param {Array|String} globs Glob patterns to delete
 */
function cleanUp(globs) {
  return del(globs, {
    force: true
  });
}

/**
 * Functiont to output the component information gathered in tabular format
 * @param {Array} configs Array containing the component config object
 */
function outputComponentData(configs) {
  const table = new Table({
    head: ['Component File', 'Component Name', 'Version'],
    style: {
      head: ['yellow'],
      border: ['yellow']
    }
  });
  configs.forEach(config => {
    table.push([config.componentFile, config.componentName, config.componentVersion]);
  });
  if (configs.length) {
    // Output the tabular data
    console.log(chalk.blueBright('Info: Awaiting component builds for:'));
    console.log(table.toString());
  } else {
    //global.ASOPM_SET_COMPONENT_REGISTRY = false;
    console.log(chalk.red(`(\u2718) No components to be built!`));
  }
}
/**
 * Function to output the data from the registry
 * @param {object} data The data recieved from the registry api
 * @param {string} color The color of the console string
 */
function createComponentRegistryTable(data, color = 'yellow') {
  const table = new Table({
    head: ['Component Name', 'Component version'],
    style: {
      head: [color],
      border: [color]
    }
  });
  _.each(data, d => {
    if (d.componentVersion && d.componentName) {
      table.push([d.componentName, d.componentVersion]);
    }
  });
  console.log(table.toString());
}
/**
 * function to provide configuration for minification/minimizer
 */
function getMinimizerConfig() {
  return global.FOO_PROD
    ? [
        new UglifyJsPlugin({
          uglifyOptions: {
            parse: {
              html5_comments: false
            },
            comments: false,
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true
            }
          },
          extractComments: true
        })
      ]
    : [];
}

/**
 * Function to retrieve the public path of the components used for chunking and component specific assets
 * @param {String} componentName The component name
 * @param {String} version The component version
 */
function getComponentPublicPath(componentName, version) {
  return `localhost:9000/modules/${componentName}/${version}/`;
}

/**
 * Function to retrieve the public path of the vendor used for chunking and component specific assets
 */
function getVendorPublicPath() {
  return `localhost:9000/vendor/`;
}
/**
 * Function to create the component configs used by webpack for component builds
 * @param {String} root The directory root of the application
 * @param {globString} root The glob string to check the components or apps
 */
function createComponentConfigs(root, globString, apps = false) {
  return new Promise(function(resolve, reject) {
    const configs = [];
    const componentRegistry = global.FOO_COMPONENT_REGISTRY;
    let buildComps = [];
    if (global.FOO_COMPONENTS) {
      buildComps = global.FOO_COMPONENTS.split(',').map(comp => {
        return comp.trim();
      });
    }
    glob(globString, (err, files) => {
      if (err) {
        reject(err);
        throw new Error(err);
      }
      files.forEach(file => {
        const dirname = path.dirname(file);
        const componentFile = path.basename(file);
        const componentName = path.basename(dirname);

        if (buildComps.length) {
          if (_.indexOf(buildComps, componentName) < 0) {
            return;
          }
        }
        // Get the package version of the component
        const pkg = JSON.parse(fs.readFileSync(path.join(dirname, 'package.json'), 'utf8'));
        if (componentRegistry && componentRegistry.length) {
          // Get registry entry for the component
          const registryEntry = _.find(componentRegistry, function(r) {
            return r.componentName === componentName;
          });

          if (registryEntry) {
            const registryVersion = registryEntry.componentVersion;
            if (compareVersions(pkg.version, registryVersion) !== 1) {
              return;
            }
          }
        }
        const componentData = {
          root,
          dirname,
          componentFile,
          componentName,
          componentVersion: pkg.version,
          isApp: apps //To be put here once node caching strategy is in place
        };
        let webpackConfig = {
          ...componentData,
          webpack: {
            mode: global.FOO_PROD ? 'production' : 'development',
            devtool: global.FOO_SOURCEMAP && 'source-map',
            entry: file,
            output: {
              filename: `${componentFile}`,
              publicPath: getComponentPublicPath(componentName, pkg.version),
              path: path.resolve(root, 'dist', 'modules', componentName, pkg.version),
              library: [NAMESPACE, componentName],
              libraryTarget: 'umd',
              globalObject: 'this'
            },
            module: {
              rules: rules.getComponentWebpackRules(pluginsObj)
            },
            externals: require('./_externals')(),
            optimization: {
              minimizer: getMinimizerConfig()
            },
            plugins: plugins.getComponentWebpackPlugins(pluginsObj, componentData)
          }
        };
        configs.push(webpackConfig);
      });
      outputComponentData(configs);
      resolve(configs);
    });
  });
}
/**
 * Function to create the vendor configs used by webpack for vendor,polyfill file builds
 * @param {String} root The directory root of the application
 */
function createVendorConfigs(root) {
  return new Promise(resolve => {
    const createVendorConfigs = {
      webpack: {
        mode: global.FOO_PROD ? 'production' : 'development',
        devtool: global.FOO_SOURCEMAP && 'source-map',
        entry: {
          vendor: path.resolve(root, 'src/client/vendor/vendor.js'),
          polyfills: path.resolve(root, 'src/client/vendor/polyfills.js')
        },
        output: {
          filename: `[name].js`,
          path: path.resolve(root, 'dist', 'vendor'),
          libraryTarget: 'umd',
          publicPath: getVendorPublicPath()
        },
        module: {
          rules: rules.getVendorWebpackRules(pluginsObj)
        },
        optimization: {
          minimizer: global.FOO_PROD
            ? [
                new UglifyJsPlugin({
                  uglifyOptions: {
                    parse: {
                      html5_comments: false
                    },
                    comments: false,
                    compress: {
                      warnings: false,
                      drop_debugger: true
                      // pure_funcs: ['console.log', 'console.info', 'console.warn']
                    }
                  },
                  extractComments: true
                })
              ]
            : []
        },
        plugins: plugins.getVendorWebpackPlugins(pluginsObj)
      }
    };
    resolve([createVendorConfigs]);
  });
}

/**
 * Function to get the components and versions from the Component registry
 * This would return all the latest versions of the components registered in the regirstry
 */
async function getComponentVersions() {
  const compRegistryAPI = global.ASOPM_COMPREGISTRY_URL;
  return axios
    .get(compRegistryAPI)
    .then(res => {
      if (res.data && res.data.length) {
        console.log(chalk.green('Component Registry Data:'));
        createComponentRegistryTable(res.data);
      } else {
        console.log(chalk.red(`(\u2718) No components found in registry!`));
      }
      return res.data;
    })
    .catch(err => {
      console.log(chalk.red('Component Registry Error -'));
      console.log(chalk.red(`(\u2718) ${err.toString()}`));
      return { err };
    });
}

/**
 * Function to set lastest versions of components in the component registry
 * @param {Array} data The components and versions to be updated in the DB
 */
async function setComponentVersions(data) {
  const compRegistryAPI = global.ASOPM_COMPREGISTRY_URL;
  return axios
    .post(compRegistryAPI, data)
    .then(res => {
      console.log(chalk.green('Updated Component Registry Data:'));
      createComponentRegistryTable(res.data, 'green');
      return res.data;
    })
    .catch(err => {
      console.log(chalk.red('Component Registry Error -'));
      console.log(chalk.red(`(\u2718) ${err.toString()}`));
      return { err };
    });
}

/**
 * Function to create an async webpack compiler instance and run it
 * @param {Object} config The webpack condig object for the component or file
 * @param {Object} [options] The component config object
 */
function createWebpackInstance(config, options = {}) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    const compilerCb = async (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details.toString());
        }
        reject({
          err,
          options
        });
        throw new Error(err);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors.toString());
        reject({
          err: new Error(`${config.componentName} build resulted in errors!`),
          options
        });
        throw new Error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings.toString());
      }
      resolve({
        stats,
        options
      });
    };
    if (global.FOO_WATCH) {
      compiler.watch({}, compilerCb);
    } else {
      compiler.run(compilerCb);
    }
  });
}

module.exports = {
  cleanUp,
  setComponentVersions,
  getComponentVersions,
  createComponentConfigs,
  createVendorConfigs,
  createWebpackInstance
};
