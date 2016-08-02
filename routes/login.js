const query = require('querystring');

var express = require('express');
var router = express.Router();

const TYPE = process.env.npm_config_type || 'memory';
const model = require(`./../model/${TYPE}`);

router.get('/', (req, res, next) => {
    res.render('login', {
        layout: false
    });
    next();
});

router.post('/', (req, res, next) => {
    let backUrl = req.query.backUrl ? req.query.backUrl : '/';
    delete (req.query.backUrl);
    backUrl += backUrl.indexOf('?') > -1 ? '&' : '?';
    backUrl += query.stringify(req.query);
    if (req.session.authorized) res.redirect(backUrl);
    else if (req.body.username && req.body.password) {
        model.oauth2.user.fetchByUsername(req.body.username, (err, user) => {
            if(err) next(err);
            else {
                model.oauth2.user.checkPassword(user, req.body.password, (err, valid) => {
                    if(err) next(err);
                    else if(!valid) res.redirect(req.url);
                    else {
                        req.session.user = user;
                        req.session.authorized = true;
                        req.redirect(backUrl);
                    }
                });
            }
        });
    } else res.redirect('req.url');
    next();
});

module.exports = router;