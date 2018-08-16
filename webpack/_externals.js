/**
 * Webpack external data configuration for app and component files.
 */
module.exports = function() {
  return {
    react: {
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React'
    },
    classnames: {
      amd: 'classnames',
      commonjs: 'classnames',
      commonjs2: 'classnames',
      root: 'classNames'
    },
    'react-dom': {
      amd: 'react-dom',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      root: 'ReactDOM'
    },
    'pubsub-js': {
      amd: 'pubsub-js',
      commonjs: 'pubsub-js',
      commonjs2: 'pubsub-js',
      root: 'PubSub'
    },
    axios: {
      amd: 'axios',
      commonjs: 'axios',
      commonjs2: 'axios',
      root: 'axios'
    },
    'prop-types': {
      amd: 'prop-types',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      root: 'PropTypes'
    },
    redux: {
      amd: 'redux',
      commonjs: 'redux',
      commonjs2: 'redux',
      root: 'Redux'
    },
    'react-redux': {
      amd: 'react-redux',
      commonjs: 'react-redux',
      commonjs2: 'react-redux',
      root: 'ReactRedux'
    },
    'redux-saga': {
      amd: 'redux-saga',
      commonjs: 'redux-saga',
      commonjs2: 'redux-saga',
      root: 'ReduxSaga'
    },
    'react-emotion': {
      amd: 'react-emotion',
      commonjs: 'react-emotion',
      commonjs2: 'react-emotion',
      root: 'ReactEmotion'
    },
    'react-modal': {
      amd: 'react-modal',
      commonjs: 'react-modal',
      commonjs2: 'react-modal',
      root: 'ReactModal'
    },
    exenv: {
      amd: 'exenv',
      commonjs: 'exenv',
      commonjs2: 'exenv',
      root: 'ExecutionEnvironment'
    }
  };
};
