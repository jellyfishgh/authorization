const crypto = require('crypto');
const RethinkDb = require('rethinkdb');
const connection = require('./../connection.js');

let TABLE = 'access_token';

module.exports = {
    getToken: function(accessToken) {
        return accessToken.token;
    },
    create: function(userId, clientId, scope, ttl, cb) {
        let token = crypto.randomBytes(64).toString('hex');
        let obj = {
            token: token,
            userId: userId,
            clientId: clientId,
            scope: scope,
            ttl: new Date().getTime() + ttl * 1000
        };
        connection.acquire((err, conn) => {
            if(err) return cb(err);
            RethinkDb.table(TABLE).insert(obj, {}).run(conn, (err) => {
                cb(err, token);
            });
        });
    },
    fetchByToken: function(token, cb) {
        connection.acquire((err, conn) => {
            if(err) return cb(err);
            RethinkDb.table(TABLE).filter({token: token}).run(conn, (err, cursor) => {
                if(err) return cb(err);
                cursor.next(cb);
            });
        });
    },
    checkTtl: function(accessToken) {
        return accessToken.ttl > new Date().getTime();
    },
    fetchByUserIdClientId: function(userId, clientId, cb) {
        let where = RethinkDb.and(
            RethinkDb.row('userId').eq(userId),
            RethinkDb.row('clientId').eq(clientId),
            RethinkDb.row('ttl').gt(new Date().getTime())
        );
        connection.acquire((err, conn) => {
            if(err) return cb(err);
            RethinkDb.table(TABLE).filter(where).orderBy(RethinkDb.desc('ttl')).limit(1).run(conn, (err, cursor) => {
                if(err) return cb(err);
                cursor.next(cb);
            });
        });
    }
};
