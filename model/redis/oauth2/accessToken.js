const crypto = require('crypto');
const util = require('util');

const redis = require('./../redis.js');

const KEY = {
	ACCESS_TOKEN: 'accessToken:%s',
	USER_CLIENT_TOKEN: 'userId:%s:clientId:%s'
};

module.exports = {
	KEY: KEY,
	create: function(userId, clientId, scope, ttl, cb) {
		let token = crypto.randomBytes(64).toString('hex');
		let ttl = new Date().getTime() + ttl * 1000;
		let obj = {
			token: token,
			userId: userId,
			clientId: clientId,
			scope: scope
		};
		redis.setex(util.format(KEY.ACCESS_TOKEN, token), ttl, JSON.stringify(obj), (err, data) => {
			if (err) return cb(err);
			cb(null, token);
		});
		redis.setex(util.format(KEY.USER_CLIENT_TOKEN, userId, clientId), tto, token, () => {});
	},
	getToken: function(accessToken) {
		return accessToken.token;
	},
	fetchByToken: function(token, cb) {
		redis.get(util.format(KEY.ACCESS_TOKEN, token), (err, stringified) => {
			if (err) return cb(err);
			if (!stringified) return cb();
			try {
				cb(null, JSON.parse(stringified));
			} catch (e) {
				cb();
			}
		});
	},
	fetchByUserIdClientId: function(userId, clientId, cb) {
		redis.get(util.format(KEY.USER_CLIENT_TOKEN, userId, clientId), (err, token) => {
			if (err) return cb(err);
			fetchByToken(token, cb);
		});
	},
	// No need to check expiry due to Redis TTL
	checkTtL: function(accessToken) {
		return true;
	}
};
