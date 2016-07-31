const users = require('./../../data.js').users;

module.exports = {
	getId: function(user) {
		return user.id;
	},
	fetchById: function(id, cb) {
		users.map((user) => {
			if (user.id === id) return cb(null, user);
		});
		cb();
	},
	fetchByUsername: function(username, cb) {
		users.map((user) => {
			if (user.username === username) return cb(null, user);
		});
		cb();
	},
	checkPassword: function(user, password, cb) {
		cb(null, user.password === password);
	},
    fetchFromRequest: function(req) {
        return req.session.user;
    }
};
