var express = require('express');
var router = express.Router();
var templateResolver = require('../utils/template-resolver');
/* GET home page. */
router.get('/*', async function(req, res, next) {
  await templateResolver(req, res, next);
});

module.exports = router;
