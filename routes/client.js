var express = require('express');
var router = express.Router();

const TYPE = process.env.npm_config_type || 'memory';
const oauth20 = require('./../oauth20.js')(TYPE);

router.get('/', oauth20.middleware.bearer, (req, res) => {
    if(!req.oauth2.accessToken)return res.status(403).send('Forbidden');
    res.send(`Hi, Dear Client ${req.oauth2.accessToken.clientId} !`);
});

module.exports = router;