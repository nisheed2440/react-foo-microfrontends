/**
 * This file contains utility functions to help build out the page using micro fronend architecture.
 */
const commonScripts = ['http://localhost:9000/vendor/polyfills.js', 'http://localhost:9000/vendor/vendor.js'];
const commonStyles = ['http://localhost:9000/vendor/vendor.css'];
function createScript(dom, src, id, defer) {
  const scriptTag = dom.window.document.createElement('script');
  if (typeof src === 'string') {
    scriptTag.src = src;
  } else {
    scriptTag.textContent = `var ${id} = ${JSON.stringify(src)};`;
  }
  if (id) {
    scriptTag.id = id;
  }
  if (defer) {
    scriptTag.setAttribute('async', true);
  }
  return scriptTag;
}
function createStyle(dom, src, id, defer) {
  const styleTag = dom.window.document.createElement('link');
  styleTag.href = src;
  styleTag.rel = 'stylesheet';

  if (id) {
    styleTag.id = id;
  }
  return styleTag;
}

module.exports = {
  commonScripts,
  createScript,
  commonStyles,
  createStyle
};
