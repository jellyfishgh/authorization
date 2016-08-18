const crypto = require('crypto');
const RethinkDb = require('rethinkdb');
const connection = require('connection');

const TABLE = 'refresh_token';

module.exports = {
    getUserId: function(refreshToken) {
        return refreshToken.userId;
    },
    getClientId: function(refreshToken) {
        return refreshToken.clientId;
    },
    fetchByToken: function(token, cb) {
        connection.acquire((err, conn) => {
            if (err) return cb(err);
            RethinkDb.table(TABLE).filter({
                token: token
            }).run(conn, (err, cursor) => {
                if (err) return cb(err);
                cursor.next(cb);
            });
        });
    },
    removeByUserIdClientId: function(userId, clientId, cb) {
        connection.acquire((err, conn) => {
            if (err) return cb(err);
            RethinkDb.table(TABLE).filter({
                userId: userId,
                clientId: clientId
            }).delete().run(conn, cb);
        });
    },
    create: function(userId, clientId, scope, cb) {
        let token = crypto.randomBytes(32).toString('hex');
        let obj = {
            token: token,
            userId: userId,
            clientId: clientId,
            scope: scope
        };
        connection.acquire((err, conn) => {
            if(err) return cb(err);
            RethinkDb.table(TABLE).insert(obj, {}).run(conn, (err) => {
                cb(err, token);
            });
        });
    }
};
