var express = require('express');
var router = express.Router();

const TYPE = process.env.npm_config_type || 'memory';
const oauth20 = require('./../oauth20.js')(TYPE);

router.get('/', oauth20.middleware.beared, (req, res) => {
    if(!req.oauth2.accessToken || !req.oauth2.accessToken.userId) return res.status(403).send('Forbidden');
    res.send(`Hi, Dear User ${req.oauth2.accessToken.userId} !`);
});

module.exports = router;