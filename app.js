const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');

const config = require('./config.js');
const TYPE = process.env.npm_config_type || 'memory';
const oauth20 = require('./oauth20.js')(TYPE);

const login = require('./routes/login');
const authorization = require('./routes/authorization');
const token = require('./routes/token');
const client = require('./routes/client');
const secure = require('./routes/secure');

const app = express();

app.set('oauth2', oauth20);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.user(session({
    'secret': 'oauth20-provider-test-server',
    'resave': false,
    'saveUninitialized': false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(oauth20.inject());

app.use('/login', login);
app.use('/authorization', authorization);
app.use('/token', token);
app.use('/client', client);
app.use('/secure', secure);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        next();
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
    next();
});


app.listen(config.server.port, config.server.host, (err) => {
    if(err) return console.log(err);
    console.log(`server started at ${config.server.host}:${config.server.port}`);
});

module.exports = app;