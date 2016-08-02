const util = require('util');
const async = require('async');
const redis = require('./redis');

const userModel = require('./oauth2/user.js');
const clientModel = require('./oauth2/client.js');

const data = require('./../data.js');

module.exports = {
	initialize: function() {
		async.parallel([
			function(cb) {
				async.eachSeries(data.users, (user, cb) => {
					redis.set(util.format(userModel.KEY.USER, user.id), JSON.stringify(user), (err) => {
						if (err) return cb(err);
						redis.set(util.format(userModel.KEY.USER_USERNAME, user.username), user.id, cb);
					});
				}, cb);
			},
			function(cb) {
				async.eachSeries(data.clients, (client, cb) => {
					redis.set(util.format(clientModel.KEY.CLIENT, client.id), JSON.stringify(client), cb);
				}, cb);
			}
		], (err) => {
			if (err)
				throw new Error('Unable to fill redis with test data');
		});
	}
};
