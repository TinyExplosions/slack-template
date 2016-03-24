var request = require('request'),
    Logger = require('fh-logger-helper'),
    $fh = require('fh-mbaas-api');

function slackAuth(code, host, cb) {
    cb = cb || function() {};
    if (!code || !host) {
        return cb({ ok: false, error: "You need to specify an access code and a host" });
    }
    var form = {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: code,
        redirect_uri: host
    }
    request.post({ url: "https://slack.com/api/oauth.access", form: form }, function(err, res, body) {
        if (err) {
            Logger.error("Error Authenticating with Slack", err);
        }
        if (res.statusCode === 200) {
            var slackResponse = JSON.parse(body);
            if (!slackResponse.ok) {
                Logger.info("Bot not installed, Slack said", slackResponse.error);
                return cb(slackResponse, null);
            } else {
                var options = {
                    "act": "save",
                    "key": slackResponse.team_id,
                    "value": body
                };
                $fh.cache(options, function(err, data) {
                    if (err) {
                        return cb({ ok: false, error: err }, null);
                    } else {
                        Logger.info("Bot Successfully installed on team", slackResponse.team_name);
                        return cb(null, slackResponse);
                    }
                });
            }
        }
    });
}

module.exports = {
    tryAuth: slackAuth
}