var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    Logger = require('fh-logger-helper');


function slackbot() {
    var app = express();
    app.use(cors());
    app.use(bodyParser());

    // Slack POST's all requests, so this will capture em
    app.post('/', function authRoute(req, res) {
        if (!req.body.token || req.body.token !== process.env.SLACK_VERIFY_TOKEN) {
            res.status(400)
            return res.send("Invalid Verification Token");
        }
        // a request will look like the following:
        // {
        //     token: 'X9RFSFDobd7hkJUwfa2bWgiQ',
        //     team_id: 'T0GV70483',
        //     team_domain: 'testing',
        //     channel_id: 'C0GV0VEJ1',
        //     channel_name: 'general',
        //     user_id: 'U0GUZGERA',
        //     user_name: 'Test',
        //     command: '/testbot',
        //     text: 'echo',
        //     response_url: 'https://hooks.slack.com/commands/T0GV70483/28877560285/Eehah8yGIXhUa15W67hYc2iM'
        // }

        // First check the command is what we want
        Logger.info("The command is", req.body.command.toUpperCase().trim());
        if (req.body.command.toUpperCase() === process.env.SLACK_BOT_COMMAND.toUpperCase()) {
            // Make text uppercase to avaoid case issues when figuring out the command
            var text = req.body.text.toUpperCase().trim();
            switch (true) {
                // Chacke that the desired command is the *first* word in the text
                case (text.indexOf("ECHO") == 0):
                    Logger.info("in echo command");
                    var echoedStr = req.body.text.replace(new RegExp("echo", "i"), "").trim();
                    var echo = "*" + echoedStr + "*... " + echoedStr + "... _" + echoedStr + "_...";
                    if (text.trim() === "ECHO") {
                        echo = "It's very quiet in here";
                    }
                    res.send({
                        text: echo
                    });
                    break;
                case (text.indexOf("HELP") == 0):
                    Logger.info("in help command");
                    res.send(helpText());
                    break;
                default:
                    Logger.info("in default command");
                    return res.send(helpText());
            }
        } else {
            res.status(400)
            return res.send("Invalid Command");
        }

    });

    return app;
}

function helpText() {
    return {
        "text": "I'm a "+process.env.SLACK_BOT_COMMAND+" from the RHMAP",
        "attachments": [{
            "color": "good",
            "title": "Shout into the void",
            "text": "`"+process.env.SLACK_BOT_COMMAND+" echo`... echo your own words back at you\n",
            "mrkdwn_in": [
                "text"
            ]
        }, {
            "title": "Additional detail",
            "text": "`"+process.env.SLACK_BOT_COMMAND+" help`... show this message again!",
            "mrkdwn_in": [
                "text"
            ]
        }]
    }
}

module.exports = slackbot;