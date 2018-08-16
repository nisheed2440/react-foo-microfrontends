/**
 * This file contains the code to resolve a template based on the URL provided to the node server.
 * This will also have fallbacks for error scenarios.
 */
const rp = require('request-promise');
const componentResolver = require('./component-resolver');
/**
 * Function to get data from a remote source.
 * @param {string} url The URL from which data needs to be fetched.
 */
async function getData(url) {
  const data = await rp({
    // The AEM API to get template URL
    url: url,
    // Timeout if the response doesn't come under 2s
    timeout: 2000
  })
    .then(function(body) {
      return {
        body
      };
    })
    .catch(function(err) {
      return {
        err
      };
    });
  return data;
}
/**
 * Function to resolve the template.
 * @param {object} req The request object from the route
 * @param {object} res The response object from the route
 * @param {object} next The request next object from the route
 */
async function templateResolver(req, res, next) {
  // Get the request URL
  const requestURL = req.params[0];
  // Get the template from template cache on NGINX
  const urlObj = await getData(`http://localhost:9000/templates/${requestURL}.html`);

  if (urlObj.err) {
    next(urlObj.err);
  } else {
    let data;
    try {
      data = urlObj.body;
    } catch (err) {
      next(err);
      return;
    }
    const outputTemplate = await componentResolver(data);
    res.send(outputTemplate);
  }
}

module.exports = templateResolver;
