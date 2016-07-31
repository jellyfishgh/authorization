const crypto = require('crypto');
const refreshTokens = require('./../../data.js').refreshTokens;

module.exports = {
	create: function(userId, clientId, scope, cb) {
		let token = crypto.randomBytes(64).toString('hex');
		let obj = {
			token: token,
			userId: userId,
			clientId: clientId,
			scope: scope
		};
		refreshTokens.push(obj);
		cb(null, token);
	},
	getUserId: function(refreshToken) {
		return refreshToken.userId;
	},
	getClientId: function(refreshToken) {
		return refreshToken.clientId;
	},
	fetchByToken: function(token, cb) {
		refreshTokens.map((refreshToken) => {
			if (refreshToken.token === token) return cb(null, refreshToken);
		});
		cb();
	},
	removeByUserIdClientId: function() {
		let i = 0;
		refreshTokens.map((refreshToken) => {
			if (refreshToken.userId === userId && refreshToken.clientId === clientId) {
				refreshToken.splice(i, 1);
				break;
			}
			i++;
		});
		cb();
	}
};
