const crypto = require('crypto');
const codes = require('./../../data.js').codes;

module.exports = {
	create: function(userId, clientId, scope, ttl, cb) {
		let code = crypto.randomBytes(32).toString('hex');
		let obj = {
			code: code,
			userId: userId,
			clientId: clientId,
			scope: scope,
			ttl: new Date().getTime() + ttl * 1000
		};
		codes.push(obj);
		cb(null, code);
	},
	fetchByCode: function(code, cb) {
		codes.map((code) => {
			if (code.code === code) return cb(null, code);
		});
		cb();
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
		let i = 0;
		codes.map((code) => {
			if (code.code === code) {
				codes.splice(i, 1);
				break;
			}
			i++;
		});
		cb();
	}
};
