/**
 * This file contains the code to resolve a component based on the template provided by AEM.
 * This would also contain/reference functions to inline critical styles and concatinate JS to reduce server round trips.
 */
const JSON5 = require('json5');
const jsdom = require('jsdom');
const minify = require('html-minifier').minify;
const rp = require('request-promise');
const requireFromString = require('require-from-string');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { JSDOM } = jsdom;
const { commonScripts, createScript, commonStyles, createStyle } = require('./utilities');
const _ = require('lodash');

function createInlineScriptDataObject(dom, data, varName) {
  const scriptEl = dom.window.document.createElement('script');
  if (varName) {
    scriptEl.textContent = `var ${varName} = ${JSON.stringify(data)}`;
  } else {
    scriptEl.textContent = data;
  }
  dom.window.document.body.append(scriptEl);
}

async function componentResolver(inputTemplate) {
  const dom = new JSDOM(inputTemplate);
  let componentScriptPromises = [];
  let scriptsDataObject = {};
  let scriptsURLObject = {};

  dom.window.document.body.querySelectorAll('[data-component]').forEach(el => {
    const componentType = el.getAttribute('data-component');
    const componentId = el.getAttribute('data-compId');
    let componentData;
    try {
      componentData = JSON5.parse(el.getAttribute('data-json'));
    } catch (err) {
      componentData = {};
    }
    scriptsDataObject[componentType] = componentData || {};
    el.removeAttribute('data-json');
    componentScriptPromises.push(
      rp(`http://localhost:9000/modules/${componentType}/1.0.0/${componentType}.component.js`)
        .then(body => {
          return { body, componentId, componentType };
        })
        .catch(err => {
          return { err, componentId, componentType };
        })
    );
  });

  const propsPromises = await Promise.all(componentScriptPromises).then(scripts => {
    let componentPropsPromises = [];
    scripts.forEach(componentScript => {
      if (componentScript.err) {
        return;
      }

      const componentReact = requireFromString(componentScript.body).default;
      const componentId = componentScript.componentId;
      const componentType = componentScript.componentType;
      if (!scriptsURLObject[componentType]) {
        scriptsURLObject[componentType] = `http://localhost:9000/modules/${componentType}/1.0.0/${componentType}.component.js`;
      }

      if (componentReact.getInitialProps) {
        componentPropsPromises.push(
          componentReact.getInitialProps().then(state => {
            scriptsDataObject[componentType] = state;
            const el = dom.window.document.querySelector(`[data-compId=${componentId}]`);
            el.innerHTML = ReactDOMServer.renderToString(
              React.createElement(componentReact, { store: { ...scriptsDataObject[componentType] } }, null)
            );
          })
        );
      } else {
        const el = dom.window.document.querySelector(`[data-compId=${componentId}]`);
        el.innerHTML = ReactDOMServer.renderToString(React.createElement(componentReact, { store: { ...scriptsDataObject[componentType] } }, null));
      }
    });
    return componentPropsPromises;
  });

  await Promise.all(propsPromises);

  createInlineScriptDataObject(dom, scriptsDataObject, 'FOOData');

  commonScripts.forEach(src => {
    dom.window.document.body.appendChild(createScript(dom, src, null));
  });

  commonStyles.forEach(src => {
    dom.window.document.head.appendChild(createStyle(dom, src, null));
  });
  
  _.forEach(scriptsURLObject, (value, key) => {
    dom.window.document.body.appendChild(createScript(dom, value, key, true));
  });

  return dom.serialize();
}

module.exports = componentResolver;
