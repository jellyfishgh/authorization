const query = require('querystring');

var express = require('express');
var router = express.Router();

const TYPE = process.env.npm_config_type || 'memory';
const oauth20 = require('./../oauth20.js')(TYPE);

function isUserAuthorized(req, res, next) {
    if(req.session.authorized) next();
    else {
        let params = req.query;
        params.backUrl = req.path;
        res.redirect('/login?' + query.stringify(params));
    }
}

router.get('/', isUserAuthorized, oauth20.controller.authorization, (req, res, next) => {
    res.render('authorization', {
        layout: false
    });
    next();
});

router.post('/', isUserAuthorized, oauth20.controller.authorization);

module.exports = router;