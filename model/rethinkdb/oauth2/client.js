const RethinkDb = require('rethinkdb');
const connection = require('./../connection.js');

const TABLE = 'client';

module.exports = {
    getId: function(client) {
        return client.id;
    },
    getRedirectUri: function(client) {
        return client.redirectUri;
    },
    fetchById: function(clientId, cb) {
        connection.acquire((err, conn) => {
            if (err) return cb(err);
            RethinkDb.table(TABLE).get(clientId).run(conn, cb);
        });
    },
    checkSecret: function(client, secret, cb) {
        return cb(null, client.secret === secret);
    }
};
