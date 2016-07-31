const oauth2lib = require('oauth20-provider');

module.exports = function(type) {
    const oauth20 = new oauth2lib({log: {level: 4}});

    const model = require(`./model/${type}`).oauth2;
    if(!model) throw new Error(`Unkonw model type: ${type}`);

    // Redefine oauth20 abstract methods

    // Set client methods
    oauth20.model.client.getId = model.client.getId;
    oauth20.model.client.getRedirectUri = model.client.getRedirectUri;
    oauth20.model.client.fetchById = model.client.fetchById;
    oauth20.model.client.checkSecret = model.client.checkSecret;

    // User
    oauth20.model.user.getId = model.user.getId;
    oauth20.model.user.fetchById = model.user.fetchById;
    oauth20.model.user.fetchByUsername = model.user.fetchByUsername;
    oauth20.model.user.fetchFromRequest = model.user.fetchFromRequest;
    oauth20.model.user.checkPassword = model.user.checkPassword;

    // Refresh token
    oauth20.model.refreshToken.getUserId = model.refreshToken.getUserId;
    oauth20.model.refreshToken.getClientId = model.refreshToken.getClientId;
    oauth20.model.refreshToken.fetchByToken = model.refreshToken.fetchByToken;
    oauth20.model.refreshToken.removeByUserIdClientId = model.refreshToken.removeByUserIdClientId;
    oauth20.model.refreshToken.create = model.refreshToken.create;

    // Access token
    oauth20.model.accessToken.getToken = model.accessToken.getToken;
    oauth20.model.accessToken.fetchByToken = model.accessToken.fetchByToken;
    oauth20.model.accessToken.checkTTL = model.accessToken.checkTTL;
    oauth20.model.accessToken.fetchByUserIdClientId = model.accessToken.fetchByUserIdClientId;
    oauth20.model.accessToken.create = model.accessToken.create;

    // Code
    oauth20.model.code.create = model.code.create;
    oauth20.model.code.fetchByCode = model.code.fetchByCode;
    oauth20.model.code.removeByCode = model.code.removeByCode;
    oauth20.model.code.getUserId = model.code.getUserId;
    oauth20.model.code.getClientId = model.code.getClientId;
    oauth20.model.code.getScope = model.code.getScope;
    oauth20.model.code.checkTTL = model.code.getScope;

    // Decision controller
    oauth20.decision = function(req, res, client, scope, user) {
        res.render('decision', {
            user: req.oauth2.model.user.getId(user),
            client: req.oauth2.model.client.getId(client),
            scope: scope.join()
        });
    };

    return oauth20;
};