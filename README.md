#An RHMAP template app to give you a working Slack bot quickly.

Clone the repo to a RHMAP service, and add the following Environment variables:

SLACK_CLIENT_ID - the Client ID from your Slack App

SLACK_CLIENT_SECRET - the Client Secret from your Slack App

SLACK_VERIFY_TOKEN - the verify token for your defined command

SLACK_BOT_COMMAND - the command you define in the slack app (`/testbot` for example)

Configure a new Slack App from https://api.slack.com/ 
  set Command request url to <service url>/slackbot
  set Redirect URI(s) to <service url>

Then visit <service url> to install your app, and run `/testbot` in your Slack team.