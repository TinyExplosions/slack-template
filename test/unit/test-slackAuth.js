global.__base = './../../';

var should = require('chai').should(),
    expect = require('chai').expect,
    fs = require('fs'),
    nock = require('nock'),
    slackAuth = require(__base + 'lib/slackAuth');

process.env.SLACK_CLIENT_ID = "12345";
process.env.SLACK_CLIENT_SECRET = "12345";

var slackNock = nock("https://slack.com/api")
    .post("/oauth.access")
    .reply(200, { "ok": false, "error": "invalid_client_id" })
    .post("/oauth.access")
    .reply(200, { "ok": false, "error": "bad_redirect_uri" })
    .post("/oauth.access")
    .reply(200, { "ok": false, "error": "code_already_used" })
    .post("/oauth.access")
    .reply(200, {
        "ok": true,
        "access_token": "accessToken",
        "scope": "identify,commands,incoming-webhook",
        "team_name": "TestTeam",
        "team_id": "TOG4563",
        "incoming_webhook": {
            "channel": "#general",
            "channel_id": "C0GV0REJ1",
            "configuration_url": "https:\\/\\/null.slack.com\\/services\\/B0V5232YV6",
            "url": "https:\\/\\/hooks.slack.com\\/services\\/TOG4563\\/B0V5232YV6\\/fTxexTGCvsrB6hN3TLTyVMCU"
        }
    });

describe('Unit Testing Slack Auth', function() {

    it('should return an error with no code', function(done) {
        slackAuth.tryAuth(null, "localhost", function(err, response) {
            expect(err.ok).to.equal(false);
            expect(err.error).to.equal('You need to specify an access code and a host');
            done();
        });
    });

    it('should return an error with no host', function(done) {
        slackAuth.tryAuth(null, "localhost", function(err, response) {
            expect(err.ok).to.equal(false);
            expect(err.error).to.equal('You need to specify an access code and a host');
            done();
        });
    });

    it('should return an error with no code or host', function(done) {
        slackAuth.tryAuth(null, "localhost", function(err, response) {
            expect(err.ok).to.equal(false);
            expect(err.error).to.equal('You need to specify an access code and a host');
            done();
        });
    });

    it('should return a "invalid_client_id" response', function(done) {
        slackAuth.tryAuth("12345", "localhost", function(err, response) {
            expect(err.ok).to.equal(false);
            expect(err.error).to.equal('invalid_client_id');
            expect(response).to.equal(null);
            done();
        });
    });

    it('should return a "bad_redirect_uri" response', function(done) {
        slackAuth.tryAuth("12345", "localhost", function(err, response) {
            expect(err.ok).to.equal(false);
            expect(err.error).to.equal('bad_redirect_uri');
            expect(response).to.equal(null);
            done();
        });
    });

    it('should return a "code_already_used" response', function(done) {
        slackAuth.tryAuth("12345", "localhost", function(err, response) {
            expect(err.ok).to.equal(false);
            expect(err.error).to.equal('code_already_used');
            expect(response).to.equal(null);
            done();
        });
    });

    it('should return a successful response', function(done) {
        slackAuth.tryAuth("12345", "localhost", function(err, response) {
            expect(err).to.equal(null);
            expect(response.ok).to.equal(true);
            expect(response.access_token).to.equal('accessToken');
            expect(response.scope).to.equal('identify,commands,incoming-webhook');
            expect(response.team_name).to.equal('TestTeam');
            expect(response.team_id).to.equal('TOG4563');
            expect(response.incoming_webhook.channel).to.equal("#general");
            expect(response.incoming_webhook.channel_id).to.equal("C0GV0REJ1");
            expect(response.incoming_webhook.configuration_url).to.equal("https:\\/\\/null.slack.com\\/services\\/B0V5232YV6");
            expect(response.incoming_webhook.url).to.equal("https:\\/\\/hooks.slack.com\\/services\\/TOG4563\\/B0V5232YV6\\/fTxexTGCvsrB6hN3TLTyVMCU");
            done();
        });
    });

});