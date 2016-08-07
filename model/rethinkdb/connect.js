const config = require('./config');
const RethinkDb = require('rethinkdb');

let _connection;

module.exports = {
    acquire: function(cb) {
        if(_connection) return cb(null, _connection);
        RethinkDb.connect(config, (err, connection) => {
            if(err) return cb(err);
            _connection = connection;
            cb(null, _connection);
        });
    },
    close: function(cb) {
        if(!_connection) return cb();
        _connection.close(cb);
    }
};
