const crypto = require('crypto');
const accessTokens = require('./../../data.js').accessTokens;

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
		accessTokens.push(obj);
		cb(null, token);
	},
	fetchByToken: function(token, cb) {
		accessTokens.map((accessToken) => {
			if (accessToken.token === token) return cb(null, token);
		});
		cb();
	},
	checkTTL: function(accessToken) {
		return accessToken.ttl > new Date().getTime();
	},
	fetchByUserIdClientId: function(userId, clientId, cb) {
		accessTokens.map((accessToken) => {
			if (accessToken.userId === userId && accessToken.clientId === clientId) return cb(null, accessToken);
		});
		cb();
	}
};
