var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    fs = require('fs'),
    api = supertest('http://localhost:8052');


process.env.SLACK_VERIFY_TOKEN = "localdevelopment";
process.env.SLACK_BOT_COMMAND = "/testbot";


describe('Testing the Slackbot', function() {

    it('should return "It\'s very quiet in here"', function(done) {
        api.post('/slackbot')
            .set('Content-Type', 'application/json')
            .send({
                token: 'localdevelopment',
                team_id: 'T0GV20483',
                team_domain: 'tinyexplosions',
                channel_id: 'C0GV0REJ1',
                channel_name: 'general',
                user_id: 'U0GUZGEMA',
                user_name: 'al',
                command: '/testbot',
                text: 'echo',
                response_url: 'https://hooks.slack.com/commands/T0GV20483/28877560885/Eehah8yGIVhUa15W67hYc2iM'
            })
            .expect(200)
            .end(function(err, res) {
                var body = res.body;
                expect(body.text).to.equal("It's very quiet in here");
                done();
            });
    });

    it('should return "*echo hello*... echo hello... echo hello..."', function(done) {
        api.post('/slackbot')
            .set('Content-Type', 'application/json')
            .send({
                token: 'localdevelopment',
                team_id: 'T0GV20483',
                team_domain: 'tinyexplosions',
                channel_id: 'C0GV0REJ1',
                channel_name: 'general',
                user_id: 'U0GUZGEMA',
                user_name: 'al',
                command: '/testbot',
                text: 'echo hello',
                response_url: 'https://hooks.slack.com/commands/T0GV20483/28877560885/Eehah8yGIVhUa15W67hYc2iM'
            })
            .expect(200)
            .end(function(err, res) {
                var body = res.body;
                expect(body.text).to.equal("*echo hello*... echo hello... echo hello...");
                done();
            });
    });

    it('should return help attachments', function(done) {
        api.post('/slackbot')
            .set('Content-Type', 'application/json')
            .send({
                token: 'localdevelopment',
                team_id: 'T0GV20483',
                team_domain: 'tinyexplosions',
                channel_id: 'C0GV0REJ1',
                channel_name: 'general',
                user_id: 'U0GUZGEMA',
                user_name: 'al',
                command: '/testbot',
                text: 'help',
                response_url: 'https://hooks.slack.com/commands/T0GV20483/28877560885/Eehah8yGIVhUa15W67hYc2iM'
            })
            .expect(200)
            .end(function(err, res) {
                var body = res.body;
                expect(body.text).to.equal("I'm a testbot from the RHMAP");
                done();
            });
    });

    it('should return help attachments if unknown text', function(done) {
        api.post('/slackbot')
            .set('Content-Type', 'application/json')
            .send({
                token: 'localdevelopment',
                team_id: 'T0GV20483',
                team_domain: 'tinyexplosions',
                channel_id: 'C0GV0REJ1',
                channel_name: 'general',
                user_id: 'U0GUZGEMA',
                user_name: 'al',
                command: '/testbot',
                text: 'buttons',
                response_url: 'https://hooks.slack.com/commands/T0GV20483/28877560885/Eehah8yGIVhUa15W67hYc2iM'
            })
            .expect(200)
            .end(function(err, res) {
                var body = res.body;
                expect(body.text).to.equal("I'm a testbot from the RHMAP");
                done();
            });
    });

    it('should return a 400 as command is wrong', function(done) {
        api.post('/slackbot')
            .set('Content-Type', 'application/json')
            .send({
                token: 'localdevelopment',
                team_id: 'T0GV20483',
                team_domain: 'tinyexplosions',
                channel_id: 'C0GV0REJ1',
                channel_name: 'general',
                user_id: 'U0GUZGEMA',
                user_name: 'al',
                command: '/no',
                text: 'buttons',
                response_url: 'https://hooks.slack.com/commands/T0GV20483/28877560885/Eehah8yGIVhUa15W67hYc2iM'
            })
            .expect(400, done);
    });

    it('should return a 400 as token is wrong', function(done) {
        api.post('/slackbot')
            .set('Content-Type', 'application/json')
            .send({
                token: '12345',
                team_id: 'T0GV20483',
                team_domain: 'tinyexplosions',
                channel_id: 'C0GV0REJ1',
                channel_name: 'general',
                user_id: 'U0GUZGEMA',
                user_name: 'al',
                command: '/testbot',
                text: 'buttons',
                response_url: 'https://hooks.slack.com/commands/T0GV20483/28877560885/Eehah8yGIVhUa15W67hYc2iM'
            })
            .expect(400, done);
    });
});