const clients = require('./../../data.js').clients;

module.exports = {
	getId: function(client) {
		return client.id;
	},
	getRedirectUri: function(client) {
		return client.redirectUri;
	},
	fetchById: function(clientId, cb) {
		clients.map((client) => {
			if (client.id === clientId) return cb(null, client);
		});
		cb();
	},
    checkSecret: function(client, secret, cb) {
        return cb(null, client.secret === secret);
    }
};
