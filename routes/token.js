var express = require('express');
var router = express.Router();

const TYPE = process.env.npm_config_type || 'memory';
const oauth20 = require('./../oauth20.js')(TYPE);

router.post('/', oauth20.controller.token);

module.exports = router;