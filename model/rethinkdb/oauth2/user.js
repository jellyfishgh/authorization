const RethinkDb = require('rethinkdb');
const connection = require('connection');

const TABLE = 'user';

module.exports = {
    getId: function(user) {
        return user.id;
    },
    fetchById: function(id, cb) {
        connection.acquire((err, conn) => {
            if(err) return cb(err);
            RethinkDb.table(TABLE).get(id).run(conn, cb);
        });
    },
    fetchByUsername: function(username, cb) {
        connection.acquire((err, conn) => {
            if(err) return cb(err);
            RethinkDb.table(TABLE).filter({username: username}).limit(1).run(conn, (err, cursor) => {
                if(err) return cb(err);
                cursor.toArray((err, users) => {
                    if(err) return cb(err);
                    cb(err, users && users.length ? users[0] : null);
                });
            });
        });
    },
    checkPassword: function(user, password, cb) {
        return cb(null, user.password === password);
    },
    fetchFromRequest: function(req) {
        return req.session.user;
    }
};
