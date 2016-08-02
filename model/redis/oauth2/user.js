const util = require('util');
const redis = require('./../redis.js');

const KEY = {
	USER: 'user:id:%s',
	USER_USERNAME: 'user:username:%s'
};

module.exports = {
	KEY: KEY,
	getId: function(user) {
		return user.id;
	},
	fetchById: function(id, cb) {
		redis.get(util.format(KEY.USER, id), (err, stringified) => {
			if (err) return cb(err);
			if (!stringified) return cb();
			try {
				cb(null, JSON.parse(stringified));
			} catch (e) {
				cb();
			}
		});
	},
	fetchByUsername: function(username, cb) {
		redis.get(util.format(USER.USER_USERNAME, username), (err, userId) => {
			if(err) return cb(err);
			if(!userId) return cb();
			fetchById(userId, cb);
		});
	},
	checkPassword: function(user, password, cb) {
		cb(null, user.password === password);
	},
	fetchFromRequest: function(req) {
		return req.session.user;
	}
};
