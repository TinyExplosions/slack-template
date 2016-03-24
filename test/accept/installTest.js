var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    fs = require('fs'),
    nock = require('nock'),
    api = supertest('http://localhost:8052');


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

describe('Installing Slack App', function() {

    it('should return the default install page when no params', function(done) {
        api.get('/')
            .expect(200)
            .end(function(err, res) {
                expect(res.text.indexOf('<h1>To install your bot, click the button below</h1>')).to.not.equal(-1)
                done();
            });
    });

    it('should return the invalid_client_id error installing page', function(done) {
        api.get('/?code=12345')
            .expect(200)
            .end(function(err, res) {
                expect(res.text.indexOf('<h1>Something went wrong installing the bot, please try again.</h1>')).to.not.equal(-1);
                expect(res.text.indexOf('invalid_client_id')).to.not.equal(-1);
                done();
            });
    });

    it('should return the bad_redirect_uri error installing page', function(done) {
        api.get('/?code=12345')
            .expect(200)
            .end(function(err, res) {
                expect(res.text.indexOf('<h1>Something went wrong installing the bot, please try again.</h1>')).to.not.equal(-1)
                expect(res.text.indexOf('bad_redirect_uri')).to.not.equal(-1);
                done();
            });
    });

    it('should return the code_already_used error installing page', function(done) {
        api.get('/?code=12345')
            .expect(200)
            .end(function(err, res) {
                expect(res.text.indexOf('<h1>Something went wrong installing the bot, please try again.</h1>')).to.not.equal(-1)
                expect(res.text.indexOf('code_already_used')).to.not.equal(-1);
                done();
            });
    });

    it('should return the successfully installed page', function(done) {
        api.get('/?code=12345')
            .expect(200)
            .end(function(err, res) {
                expect(res.text.indexOf("<h1>You've installed the bot; Go to Slack and play!</h1>")).to.not.equal(-1)
                done();
            });
    });

});