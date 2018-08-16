/**
 * Webpack Build file using webpack API.
 */
// Import Utils options
const utils = require('./webpack/_utils');
const chalk = require('chalk');
const _ = require('lodash');
const fse = require('fs-extra');

const UNCAUGHT_EXIT_CODE = 15;
const UNHANDLED_EXIT_CODE = 16;
const HANDLED_EXIT_CODE = 17;
if (global.FOO_PROD) {
  // add exit listener to abort the build process if there is error
  process.on('exit', code => {
    if (code === 0) {
      console.log('Build is succeeded!');
    }
    if (code !== 0) {
      console.log('Something went wrong. Exiting the build process with code: ', code);
      process.abort();
    }
  });
  // exit the process if uncaught
  process.on('uncaughtException', err => {
    console.log(`Caught Exception: ${err}\n`);
    process.exit(UNCAUGHT_EXIT_CODE);
  });
  // exit the process if unhandled rejection
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
    process.exit(UNHANDLED_EXIT_CODE);
  });
}

async function webpackBuild() {
  const timerLabel = chalk.green(`Webpack Build`);
  console.time(timerLabel);
  // Get registry information if you want to compare builds
  if (global.FOO_REGISTRY) {
    console.log(chalk.blueBright('Info: Awaiting latest Component Registry data!'));
    global.FOO_COMPONENT_REGISTRY = await utils.getComponentVersions();
    global.FOO_SET_COMPONENT_REGISTRY = true;
    if (global.FOO_COMPONENT_REGISTRY.err) {
      return;
    }
  }
  // Webpack configs for components as well as vendor files
  const webpackConfigs = [];
  let componentConfigs = [];
  let vendorConfigs = [];

  // Get all the component configs
  if (!global.FOO_VENDORS) {
    componentConfigs = await utils.createComponentConfigs(__dirname, './src/client/modules/**/*.component.js');
  }
  // Get the Vendor configs
  if (!global.FOO_COMPONENTS) {
    vendorConfigs = await utils.createVendorConfigs(__dirname);
  }
  // create multiple configs instead of multiple instances.
  const mappedWebpackConfigs = [...componentConfigs, ...vendorConfigs].map(config => config.webpack);
  webpackConfigs.push(utils.createWebpackInstance(mappedWebpackConfigs));

  // Clean up the dist folder
  if (!global.FOO_COMPONENTS && !global.FOO_VENDORS && !global.FOO_REGISTRY) {
    await utils.cleanUp(['./dist', './build']);
  }

  // Build all the webpack configs
  await Promise.all(webpackConfigs)
    .then(() => {
      fse.copy('./src/templates', './dist/templates');
    })
    .catch(err => {
      if (global.FOO_PROD) {
        process.exit(HANDLED_EXIT_CODE);
      }
    });
}

webpackBuild();
