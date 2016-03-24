// global.__base = './../../';
global.__base = __dirname.split('test/accept')[0];

var express = require('express'),
    mbaasApi = require('fh-mbaas-api'),
    mbaasExpress = mbaasApi.mbaasExpress(),
    bodyParser = require('body-parser'),
    server,
    port = 8052,
    app = express();

app.use(bodyParser());
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);
app.use(mbaasExpress.fhmiddleware());
app.use('/', require(__base + 'lib/signupPage.js')());
app.use('/slackbot', require(__base + 'lib/slackbot.js')());

app.use(mbaasExpress.errorHandler());

before(function(next) {
    server = app.listen(port, function() {
        // console.log("Server Started")
        next();
    });
});

after(function() {
    if (server) {
        server.close(function() {
            // console.log("Server Closed");
        });
    }
});