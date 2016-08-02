const util = require('util');

const redis = require('./../redis.js');

const KEY = {
    CLIENT: 'client:%s'
};

module.exports = {
    KEY: KEY,
    getId: function(client) {
        return client.id;
    },
    getRedirectUri: function(client) {
        return client.redirectUri;
    },
    fetchById: function(clientId, cb) {
        redis.get(util.format(KEY.CLIENT, clientId), (err, stringified) => {
            if(err) return cb(err);
            if(!stringified) return cb();
            try{
                cb(null, JSON.parse(stringified));
            }catch(e){
                cb();
            }
        });
    },
    checkSecret: function(client, secret, cb) {
        return cb(null, client.secret === secret);
    }
};
