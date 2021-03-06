var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    Logger = require('fh-logger-helper'),
    semiStatic = require('semi-static'),
    SlackAuth = require('./slackAuth');

function mainRoute() {
    var app = express();
    app.use(cors());
    app.use(bodyParser());

    app.set('public', __base + 'public'); // specify the views directory
    app.set("view engine", "jade");

    // allow serving of static files from the public directory
    app.use(express.static(__base + 'public'));

    app.get('/*', semiStatic({
        folderPath: __base + 'public',
        root: '/',
        context: function(req, done) {
            if (req.query && req.query.code) {
                Logger.info("Try to auth with Slack");
                var host = "https://" + req.get('host');
                Logger.info(host);
                return SlackAuth.tryAuth(req.query.code, host, function slackResponse(err, slackRes) {
                    if (err) {
                        return done(null, err);
                    }
                    return done(null, { ok: true });
                });
            } else if (req.query && req.query.error) {
                return done(null, {
                    cancelled: true,
                    ok: false,
                    error: req.query.error
                });
            } else {
                return done(null, {});
            }
        }
    }));

    return app;
}

module.exports = mainRoute;