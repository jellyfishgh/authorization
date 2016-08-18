const crypto = require('crypto');
const RethinkDb = require('rethinkdb');
const connection = require('./../connection.js');

const TABLE = 'authorization_code';

module.exports = {
    create: function(userId, clientId, scope, ttl, cb) {
        let code = crypto.randomBytes(32).toString('hex');
        let obj = {
            code: code,
            userId: userId,
            clientId: clientId,
            scope: scope,
            ttl: new Date().getTime() + 1000 * ttl
        };
        connection.acquire((err, conn) => {
            if (err) return cb(err);
            RethinkDb.table(TABLE).insert(obj, {}).run(conn, (err) => {
                cb(err, code);
            });
        });
    },
    fetchByCode: function(code, cb) {
        connection.acquire((err, conn) => {
            if (err) return cb(err);
            RethinkDb.table(TABLE).filter({
                code: code
            }).limit(1).run(conn, (err, cursor) => {
                if (err) return cb(err);
                cursor.next(cb);
            });
        });
    },
    getUserId: function(code) {
        return code.userId;
    },
    getClientId: function(code) {
        return code.clientId;
    },
    getScope: function(code) {
        return code.scope;
    },
    checkTtl: function(code) {
        return code.ttl > new Date().getTime();
    },
    removeByCode: function(code, cb) {
        connection.acquire((err, conn) => {
            if (err) return cb(err);
            RethinkDb.table(TABLE).filter({
                code: code
            }).delete().run(conn, cb);
        });
    }
};
