const crypto = require('crypto');
const util = require('util');

const redis = require('./../redis.js');

const KEY = {
    CODE: 'code:%s'
};

module.exports = {
    KEY: KEY,
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
        // No need to check in redis storage because of key expiry mechanism
        return true;
    },
    create: function(userId, clientId, scope, ttl, cb) {
        let code = crypto.randomBytes(32).toString('hex');
        let ttl = new Date().getTime() + ttl * 1000;
        let obj = {
            code: code,
            userId: userId,
            clientId: clientId,
            scope: scope
        };
        redis.setex(util.format(KEY.CODE, code), ttl, JSON.stringify(obj), (err) => {
            if(err) return cb(err);
            cb(null, code);
        });
    },
    fetchByCode: function(code, cb) {
        redis.get(util.format(KEY.CODE, code), (err, stringified) => {
            if(err) return cb(err);
            if(!stringified) return cb();
            try{
                cb(null, JSON.parse(stringified));
            }catch(e){
                cb();
            }
        });
    },
    removeByCode: function(code, cb) {
        redis.del(util.format(KEY.CODE, code), (err) => {
            cb(err);
        });
    }
};
