const async = require('async');
const RethinkDb = require('rethinkdb');
const connection = require('./connection.js');
const config = require('./config.js');
const data = require('./data.js');

module.exports = {
    initialize: function(cb) {
        let conn, tables;
        async.series([
            function(cb) {
                connection.acquire((err, c) => {
                    if(err) return cb(err);
                    conn = c;
                    cb();
                });
            },
            function(cb) {
                RethinkDb.dbList().run(conn, (err, dbList) => {
                    if(err) return cb(err);
                    if(dbList.indexOf(config.db) != -1) return cb();
                    RethinkDb.dbCreate(config.db).run(conn, cb);
                });
            },
            function(cb) {
                RethinkDb.db(config.db).tableList().run(conn, (err, data) => {
                    if(err) return cb(err);
                    tables = data;
                    cb();
                });
            },
            function(cb) {
                async.eachSeries(['access_token', 'refresh_token', 'authorization_code', 'client', 'user'], (t, cb) => {
                    if(tables.indexOf(t) != -1) return cb();
                    RethinkDb.db(config.db).tableCreate(t, {}).run(conn, cb);
                }, cb);
            },
            function(cb) {
                async.eachSeries(data.users, (obj, cb) => {
                    RethinkDb.table('user').get(obj.id).replace(obj).run(conn, cb);
                }, cb);
            },
            function(cb) {
                async.eachSeries(data.clients, (obj, cb) => {
                    RethinkDb.table('client').get(obj.id).replace(obj).run(conn, cb);
                }, cb);
            }
        ], cb);
    }
};

/*
When a file is run directly from Node.js, require.main is set to its module.
That means that you can determine whether a file has been run directly by testing
*/

if(require.main === module) {
    module.exports.initialize((err) => {
        if(err) return console.error(err);
        console.log('Data initialized');
        console.log('Closing connection to RethinkDB');
        connection.close((err) => {
            if(err) return console.error(err);
            console.log('Finished');
        });
    });
}
