const crypto = require('crypto');
const util = require('util');

const redis = require('./../redis.js');

const KEY = {
    TOKEN: 'refreshToken:%s'
};

module.exports = {
    getUserId: function(refreshToken) {
        return refreshToken.userId;
    },
    getClientId: function(refreshToken) {
        return refreshToken.clientId;
    },
    create: function(userId, clientId, scope, cb) {
        let token = crypto.randomBytes(64).toString('hex');
        let obj = {
            token: token,
            userId: userId,
            clientId: clientId,
            scope: scope
        };
        redis.set(util.format(KEY.TOKEN, token), JSON.stringify(obj), (err) => {
            if(err) return cb(err);
            cb(null, token);
        });
    },
    fetchByToken: function(token, cb) {
        redis.get(util.format(KEY.TOKEN, token), (err, stringified) => {
            if(err) return cb(err);
            if(!stringified) return cb();
            try{
                cb(null, JSON.parse(stringified));
            }catch(e){
                cb();
            }
        });
    },
    removeByUserIdClientId: function(userId, clientId, cb) {
        redis.keys(util.format(KEY.TOKEN, '*'), (err, keys) => {
            if(err) return cb(err);
            keys.map((key) => {
                redis.get(key, (err, stringified) => {
                    let refreshToken = JSON.parse(stringified);
                    if(refreshToken.userId === userId && refreshToken.clientId === clientId) {
                        redis.del(key, (err) => {
                            cb(err);
                        });
                        break;
                    }
                });
            });
        });
    }
};
